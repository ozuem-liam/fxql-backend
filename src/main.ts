import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { addColors, createLogger, format, Logger, transports } from 'winston';
import WinstonSentryTransport from 'winston-transport-sentry-node';
import { LoggerSetupParams } from './modules/fxql/type/common.types';
import { ConfigService } from '@nestjs/config';
import { GeneralUtil } from './modules/common/general.util';
import * as Sentry from '@sentry/node';
import { ErrorLoggingInterceptor } from './modules/common/error-logging.interceptor';
import { VersioningType } from '@nestjs/common';

/**
 * Enable logging using Winston.
 * See https://www.npmjs.com/package/nest-winston
 *
 * @returns
 * @param params
 */
function setupWinstonLogger(params: LoggerSetupParams): Logger {
  const { node_env, sentry_dsn, log_to_console } = params;

  // Custom logging levels for winston.
  const errorLoggingLevels = {
    levels: {
      fatal: 0,
      error: 1,
      warn: 2,
      debug: 3,
      info: 4,
    },
    colors: {
      fatal: 'red',
      error: 'red',
      warn: 'yellow',
      debug: 'blue',
      info: 'green',
    },
  };

  const sentryTransport = new WinstonSentryTransport({
    sentry: {
      dsn: sentry_dsn,
      environment: node_env,
    },
    level: 'error',
  });

  const winstonLoggerInstance = createLogger({
    levels: errorLoggingLevels.levels,
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.ms(),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
      format.prettyPrint(),
    ),
    defaultMeta: { service: 'fxql-api' },
    transports: [sentryTransport],
  });

  // Enable logging to the console in non production modes.
  if (log_to_console) {
    winstonLoggerInstance.add(
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.ms(),
          nestWinstonModuleUtilities.format.nestLike('FXQL-API', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    );
  }

  addColors(errorLoggingLevels.colors);

  return winstonLoggerInstance;
}

async function bootstrap() {
  const configApp = await NestFactory.create(AppModule);
  const configService = configApp.get(ConfigService);

  // Ensure that all required environment variables are set.
  const { success, message } = GeneralUtil.ensureAllEnvironmentVariablesAreSet(configService);
  if (!success) {
    // eslint-disable-next-line no-console
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      instance: setupWinstonLogger({
        node_env: configService.get('NODE_ENV'),
        sentry_dsn: configService.get('SENTRY_DSN'),
        log_to_console: configService.get('LOG_TO_CONSOLE'),
      }),
    }),
  });

    // Setup Sentry for error reporting.
    Sentry.init({
      dsn: configService.get('SENTRY_DSN'),
      environment: configService.get('NODE_ENV') || 'undefined-environment',
    });

    // Handles error logging to sentry and adds more info to the errors returned by the API.
    app.useGlobalInterceptors(new ErrorLoggingInterceptor());
  
    // Create the OPENAPI documentation. See https://docs.nestjs.com/openapi/introduction
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('FXQL API')
      .setDescription('The FXQL REST API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
    await app.listen(configService.get('PORT') || 3000);
}
bootstrap();

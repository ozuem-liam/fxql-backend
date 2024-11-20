import { ConfigService } from '@nestjs/config';

export class GeneralUtil {
  /**
   * Ensure that all required environment variables are set.
   * @param configService
   * @returns { success: boolean, message: string }
   */
  public static ensureAllEnvironmentVariablesAreSet(configService: ConfigService): {
    success: boolean;
    message: string;
  } {
    const requiredEnvironmentVariables = [
      'NODE_ENV',
      'PORT',
      'SENTRY_DSN',
      'DATABASE_URL',
      'LOG_TO_CONSOLE',
    ];

    const unsetEnvironmentVariables = requiredEnvironmentVariables.filter(
      (env) => !configService.get(env),
    );
    if (unsetEnvironmentVariables.length > 0) {
      const errorMessage = `The API failed to start because the following environment variables are not defined: [${unsetEnvironmentVariables}]`;
      // return { success: false, message: errorMessage };
      throw new Error(errorMessage);
    }

    return { success: true, message: '' };
  }
}

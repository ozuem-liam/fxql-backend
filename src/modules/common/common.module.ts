import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseRepository } from './base.repository';
import { GlobalResponseHandler } from './response-handler';
import { PrismaService } from './prisma.service';

/**
 * The common module houses all functionality that is shared across the entire application.
 * It includes the following:
 *  - Database module and connection using the PrismaService
 *  - Logger module and service using the LoggerService
 *
 * The common module is a global module, meaning that it is automatically imported into all other modules.
 */
@Global()
@Module({
  providers: [
    PrismaService,
    BaseRepository,
    GlobalResponseHandler,
  ],
  imports: [
    ConfigModule.forRoot(),
  ],
  exports: [
    PrismaService,
    BaseRepository,
    GlobalResponseHandler
  ],
})
export class CommonModule {}
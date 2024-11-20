import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  /**
   *
   */
  async onModuleInit() {
    await this.connectWithRetry();
  }

  /**
   *
   */
  private async connectWithRetry() {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await this.$connect();
        this.logger.log('Connected to the database');
        return;
      } catch (error) {
        this.logger.log(
          `Error connecting to the database (Attempt ${retries + 1}):`,
          error.message,
        );
        retries++;
      }
    }

    throw new Error(
      `Unable to connect to the database after ${maxRetries} attempts`,
    );
  }
}

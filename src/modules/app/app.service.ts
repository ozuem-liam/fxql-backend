import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Health check for the API
   * @returns
   */
  getHealthCheck(): object {
    return {
      code: 'FXQL-200',
      message: 'FXLQ API is running',
    };
  }
}

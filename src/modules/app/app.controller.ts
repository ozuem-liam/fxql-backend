import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SwaggerApiTagsEnum } from '../common/common.enum';

@Controller()
@ApiTags(SwaggerApiTagsEnum.DEFAULT)
export class AppController {
  /**
   *
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Redirects the base URL to the health check endpoint
   * @returns
   */
  @Get('')
  @Redirect('/health-check', 308)
  redirectBaseUrlToHealthCheck() {
    return 'unimplemented';
  }

  /**
   * Health check endpoint for the API
   * @returns
   */
  @Get('/health-check')
  getHealthCheck(): object {
    return this.appService.getHealthCheck();
  }
}

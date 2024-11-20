import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { IGlobalResponseHandlerProvider } from 'src/modules/fxql/interface/common.interface';
import { CustomErrorTypes, GlobalResponseType, GlobalSuccessRequestPayload } from 'src/modules/fxql/type/common.types';

// Define a helper function to handle responses
@Injectable()
export class GlobalResponseHandler implements IGlobalResponseHandlerProvider {
  private readonly logger = new Logger(GlobalResponseHandler.name);

  /**
   *
   */
  constructor() {}

  /**
   *
   */
  async handleControllerResponse<T>(
    res: Response,
    resp: GlobalResponseType<T>,
  ): Promise<Response<GlobalResponseType<T>>> {
    const statusCodeArray = resp.code.split("-");
    const statusCode = parseInt(statusCodeArray[1])
    return res.status(statusCode).json(resp);
  }

  /**
   *
   */
  handleServiceResponse<T>(
    resp: CustomErrorTypes | GlobalSuccessRequestPayload<T>,
  ): GlobalResponseType<T> {
    if (
      resp instanceof BadRequestException ||
      resp instanceof InternalServerErrorException ||
      resp instanceof NotFoundException
    ) {
      return {
        code: `FXQL-${resp.getStatus()}`,
        message: resp?.message,
        data: resp,
      };
    }
    return {
      code: `FXQL-${HttpStatus.OK}`,
      message: resp.message,
      data: resp.data as T,
    };
  }
}

import {
  CustomErrorTypes,
  GlobalResponseType,
  GlobalSuccessRequestPayload,
} from '../../fxql/type/common.types';
import { Response } from 'express';

export interface IGlobalResponseHandlerProvider {
  handleControllerResponse<T>(
    res: Response,
    resp: GlobalResponseType<T>,
  ): Promise<Response<GlobalResponseType<T>>>;
  handleServiceResponse<T>(
    resp: CustomErrorTypes | GlobalSuccessRequestPayload<T>,
  ): GlobalResponseType<T>;
}

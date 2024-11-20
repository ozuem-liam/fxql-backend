import { Body, Controller, Inject, Post, Res, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrencyRate } from '@prisma/client';
import { Response } from 'express';
import { SwaggerApiTagsEnum } from '../../common/common.enum';
import { GlobalResponseHandler } from '../../common/response-handler';
import { FXQLStatementDto } from '../../fxql/dto/fxql.dto';
import { IGlobalResponseHandlerProvider } from '../../fxql/interface/common.interface';
import { FxqlService } from '../../fxql/service/fxql.service';
import { GlobalResponseType } from '../../fxql/type/common.types';
import { FxqlValidationPipe } from '../pipe/fxql.pipe';

@Controller('fxql-statements')
@ApiTags(SwaggerApiTagsEnum.FXQL)
export class FxqlController {
  /**
   *
   */
  constructor(
    private readonly fxqlService: FxqlService,
    @Inject(GlobalResponseHandler)
    private readonly globalResponseHandler: IGlobalResponseHandlerProvider,
  ) {}

  /**
   * Create FXQL Statements
   */
  @ApiOperation({ description: 'Create FXQL Statements' })
  @Post()
  @UsePipes(FxqlValidationPipe)
  async processFxql(
    @Body() fxqlStatementDto: FXQLStatementDto[],
    @Res() res: Response,
  ): Promise<Response<GlobalResponseType<CurrencyRate[]>>> {
    const resp = await this.fxqlService.processFxql(fxqlStatementDto);
    return await this.globalResponseHandler.handleControllerResponse<CurrencyRate[]>(res, resp);
  }
}


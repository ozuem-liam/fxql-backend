import { BadRequestException, Inject, Injectable, Type } from '@nestjs/common';
import { CurrencyRate } from '@prisma/client';
import { CustomValidationPipe } from '../../common/custom-validation.pipe';
import { GlobalResponseHandler } from '../../common/response-handler';
import { FXQLStatementDto } from '../../fxql/dto/fxql.dto';
import { IGlobalResponseHandlerProvider } from '../../fxql/interface/common.interface';
import {
  FXQLStatementData,
  IFxqlProvider,
} from '../../fxql/interface/fxql.interface';
import { FxqlRepository } from '../../fxql/repository/fxql.repository';
import { GlobalResponseType } from '../../fxql/type/common.types';

@Injectable()
export class FxqlService {
  constructor(
    @Inject(FxqlRepository)
    private readonly fxqlRepository: IFxqlProvider,
    @Inject(GlobalResponseHandler)
    private readonly globalResponseHandler: IGlobalResponseHandlerProvider,
    private readonly customValidationPipe: CustomValidationPipe,
  ) {}

  /**
   * Approve or Reject multiple limits
   */
  public async processFxql(
    payload: FXQLStatementDto[],
  ): Promise<GlobalResponseType<CurrencyRate[]>> {
    try {
      await this.validateBeneficiaryPayload<FXQLStatementDto>(
        payload[0],
        FXQLStatementDto,
      );

      const fxqlStatements = await this.returnUniqueFxql(payload);
      const currencyPairs = fxqlStatements.map((obj) => obj.currencyPair);

      let fxqlResults = await this.fxqlRepository.findMany(currencyPairs);
      let results: CurrencyRate[] = [];

      if (fxqlResults.length <= currencyPairs.length) {
        for (const obj of fxqlStatements) {
          const fxql = await this.fxqlRepository.findOne(obj.currencyPair);
          if (fxql) {
            const updatedFxql = await this.fxqlRepository.update(
              fxql?.EntryId,
              obj,
            );
            results.push(updatedFxql);
          } else {
            const createdFxql = await this.fxqlRepository.create(obj);
            results.push(createdFxql);
          }
        }
      }
      return this.globalResponseHandler.handleServiceResponse<CurrencyRate[]>({
        message: 'Rates Parsed Successfully.',
        data: results,
      });
    } catch (error) {
      return this.globalResponseHandler.handleServiceResponse(
        new BadRequestException(error.message),
      );
    }
  }

  /**
   *
   */
  public async validateBeneficiaryPayload<T>(
    payload: T,
    metatype: any,
  ): Promise<FXQLStatementData | BadRequestException> {
    try {
      return await this.customValidationPipe.transform(payload, {
        metatype,
        type: 'body',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async returnUniqueFxql(
    payload: FXQLStatementDto[],
  ): Promise<FXQLStatementData[]> {
    let results: FXQLStatementData[] = [];
    payload.map((obj: FXQLStatementData) => {
      let idx = null;
      const hasValue = results.find(
        (fxql: FXQLStatementData, index: number) => {
          if (fxql.currencyPair == obj.currencyPair) {
            idx = index;
            return true;
          }
          return false;
        },
      );
      if (hasValue) {
        results[idx] = obj;
      } else {
        results.push(obj);
      }
    });
    return results;
  }
}

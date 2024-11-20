import { Injectable } from '@nestjs/common';
import { CurrencyRate } from '@prisma/client';
import { BaseRepository } from '../../common/base.repository';
import { FXQLStatementData, FXQLStatementSelectedFields, IFxqlProvider } from '../../fxql/interface/fxql.interface';

@Injectable()
export class FxqlRepository extends BaseRepository implements IFxqlProvider {
  /**
   * Store valid entries
   */
  public async create(
    parsedData: FXQLStatementData,
  ): Promise<CurrencyRate> {
      const pairArray = parsedData.currencyPair.split('-');
      return await this.prisma.currencyRate.create({
        data: {
          CurrencyPair: parsedData.currencyPair,
          SourceCurrency: pairArray[0],
          DestinationCurrency: pairArray[1],
          BuyPrice: parsedData.buy,
          SellPrice: parsedData.sell,
          CapAmount: parsedData.cap,
        },
        select: FXQLStatementSelectedFields,
      });
  }

  /**
   * Get all entry
   */
  public async findMany(
    currencyPair: string[],
  ): Promise<CurrencyRate[]> {
      return await this.prisma.currencyRate.findMany({
        where: {
          CurrencyPair: { in: currencyPair },
        },
      });
  }
  /**
   * Get an entry
   */
  public async findOne(
    currencyPair: string,
  ): Promise<CurrencyRate> {
      return await this.prisma.currencyRate.findUnique({
        where: {
          CurrencyPair: currencyPair,
        },
        select: FXQLStatementSelectedFields,
      });
  }
  /**
   * Update an entry
   */
  public async update(
    entryId: number,
    data: FXQLStatementData,
  ): Promise<CurrencyRate> {
      return await this.prisma.currencyRate.update({
        where: {
          EntryId: entryId,
        },
        data: {
          SellPrice: data.sell,
          BuyPrice: data.buy,
          CapAmount: data.cap
        },
        select: FXQLStatementSelectedFields,
      });
  }

}

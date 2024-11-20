import { CurrencyRate } from '@prisma/client';

export const FXQLStatementSelectedFields = {
    EntryId: true,
    SourceCurrency: true,
    DestinationCurrency: true,
    SellPrice: true,
    BuyPrice: true,
    CapAmount: true,
    CurrencyPair: false,
    createdAt: false,
}
export class FXQLStatementData {
  currencyPair: string;
  buy: number;
  sell: number;
  cap: number;
  length?: number;
}

export interface IFxqlProvider {
  create(data: FXQLStatementData): Promise<CurrencyRate>;
  findOne(currencyPair: string): Promise<CurrencyRate>;
  findMany(currencyPair: string[]): Promise<CurrencyRate[]>;
  update(entryId: number, data: FXQLStatementData): Promise<CurrencyRate>;
}

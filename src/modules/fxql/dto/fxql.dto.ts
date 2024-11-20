import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';


export class FXQLStatementDto {
  @IsString()
  @IsNotEmpty()
  currencyPair: string;

  @IsNumber()
  @IsPositive()
  buy: number;

  @IsNumber()
  @IsPositive()
  sell: number;

  @IsNumber()
  @IsPositive()
  cap: number;
}

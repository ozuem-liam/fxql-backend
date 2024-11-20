import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FxqlValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value.FXQL !== 'string') {
      throw new BadRequestException('Invalid FXQL input');
    }

    // Parse and validate
    const rawStatements = value.FXQL.split(/\\n\\n+/); // Split statements by double newlines
    const { validatedStatements, errors } = this.validateFXQL(rawStatements);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        code: 'FXQL-400',
        errors,
      });
    }

    return validatedStatements;
  }

  private validateFXQL(rawStatements: string[]) {
    const errors: string[] = [];
    const validatedStatements = [];

    rawStatements.forEach((raw, index) => {
      const rawData = raw.replace(/\\n/g, '\n')
      const trimmed = rawData.trim();
 
      // Match the pattern
      const match = /^(?<SourceCurrency>[A-Z]{3})-(?<DestinationCurrency>[A-Z]{3})\s\{\n\s+BUY\s(?<BuyPrice>[\d.]+)\n\s+SELL\s(?<SellPrice>[\d.]+)\n\s+CAP\s(?<CapAmount>\d+)\n\}$/.exec(
        trimmed
      );
      
      if (!match) {
        errors.push(`Statement at index ${index} has invalid syntax.`);
        return;
      }

      const { SourceCurrency, DestinationCurrency, BuyPrice, SellPrice, CapAmount } = match.groups!;
      const buyNum = parseFloat(BuyPrice);
      const sellNum = parseFloat(SellPrice);
      const capNum = parseInt(CapAmount, 10);

      const statementErrors: string[] = [];

      if (SourceCurrency !== SourceCurrency.toUpperCase() || DestinationCurrency !== DestinationCurrency.toUpperCase()) {
        statementErrors.push(`Currency pair "${SourceCurrency}-${DestinationCurrency}" must be uppercase.`);
      }
      if (isNaN(buyNum)) {
        statementErrors.push(`Invalid BUY value: "${BuyPrice}".`);
      }
      if (isNaN(sellNum)) {
        statementErrors.push(`Invalid SELL value: "${SellPrice}".`);
      }
      if (isNaN(capNum) || capNum < 0) {
        statementErrors.push(`Invalid CAP value: "${CapAmount}".`);
      }

      if (statementErrors.length > 0) {
        errors.push(
          `Statement at index ${index}: ${statementErrors.join(', ')}`
        );
      } else {
        validatedStatements.push({
          currencyPair: `${SourceCurrency}-${DestinationCurrency}`,
          buy: buyNum,
          sell: sellNum,
          cap: capNum,
        });
      }
    });

    return { validatedStatements, errors };
  }
}

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe implements PipeTransform<any> {
  /**
   *
   */
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
 
    // Skip validation if there's no metatype or the type isn't a class
    if (!metatype || !this.toValidate(metadata)) {
      return value;
    }

    // Transform plain object into an instance of the metatype class
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        code: 'FXQL-400',
        message: 'Validation failed',
        validationErrors: this.formatErrors(errors),
      });
    }

    // Return the validated and transformed object as an instance of the DTO class
    return object;
  }

  /**
   *
   */
  private formatErrors(errors: ValidationError[]) {
    return errors.map((err) => ({
      field: err.property,
      errors: Object.values(err.constraints || {}),
    }));
  }

  // toValidate should now be public and match the base class signature
  /**
   *
   */
  public toValidate(metadata: ArgumentMetadata): boolean {
    const types: Array<{ new (...args: any[]): any }> = [String, Boolean, Number, Array, Object];
    return !types.includes(metadata.metatype);
  }
}

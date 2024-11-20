import { Module } from '@nestjs/common';
import { FxqlController } from './controller/fxql.controller';
import { FxqlService } from './service/fxql.service';
import { FxqlRepository } from './repository/fxql.repository';
import { CustomValidationPipe } from '../common/custom-validation.pipe';


@Module({
  imports: [],
  controllers: [FxqlController],
  providers: [
    FxqlRepository, 
    FxqlService,
    CustomValidationPipe
  ],
})
export class FxqlModule {}

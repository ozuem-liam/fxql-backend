import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { FxqlModule } from '../fxql/fxql.module';

@Module({
  imports: [    
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    FxqlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

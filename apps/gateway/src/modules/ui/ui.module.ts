import { Module } from '@nestjs/common';
import { UiController } from './ui.controller';
import { FormAuthController } from './form-auth.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UiController, FormAuthController],
})
export class UiModule {}

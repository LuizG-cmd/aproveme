import { Module } from '@nestjs/common';
import { PayableModule } from './payable/payable.module';
import { AssignorModule } from './assignor/assignor.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PayableModule, AssignorModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

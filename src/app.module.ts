import { Module } from '@nestjs/common';
import { PayableModule } from './payable/payable.module';
import { AssignorModule } from './assignor/assignor.module';
import { AuthModule } from './auth/auth.module';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [PayableModule, AssignorModule, AuthModule, RabbitMqModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

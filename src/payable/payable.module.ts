import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableController } from './payable.controller';
import { PrismaService } from 'src/prisma.service';
import { RabbitMqModule } from 'src/rabbitmq/rabbitmq.module';
import { BatchController } from './batch/batch.queue.controller';
import { BatchService } from './batch/batch.queue.service';

@Module({
  imports: [RabbitMqModule],
  controllers: [PayableController, BatchController],
  providers: [PayableService, PrismaService, BatchService],
})
export class PayableModule {}

import { Controller } from '@nestjs/common';
import { BatchService } from './batch.queue.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreatePayableDto } from '../dto/create-payable.dto';

interface batchData {
  id: string;
  payables: CreatePayableDto[];
  createdAt: Date;
}

@Controller()
export class BatchController {
  constructor(private batchService: BatchService) {}

  @EventPattern('batch_queue')
  async handleBatchProcessing(@Payload() data: batchData) {
    await this.batchService.processBatch(data);
  }
}

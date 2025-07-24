import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { BatchCreateDto } from './batch/batch.queue.dto';

@Controller()
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Post('integrations/payable')
  create(@Body() createPayableDto: CreatePayableDto) {
    return this.payableService.create(createPayableDto);
  }

  @Post('integrations/payable/batch')
  createBatch(@Body() createBatchDto: BatchCreateDto) {
    return this.payableService.createBatch(createBatchDto);
  }

  @Get('integrations/payables')
  findAll() {
    return this.payableService.findAll();
  }

  @Get('integrations/payable/:id')
  findOne(@Param('id') id: string) {
    return this.payableService.findOne(id);
  }

  @Patch('integrations/payable/:id')
  update(@Param('id') id: string, @Body() updatePayableDto: UpdatePayableDto) {
    return this.payableService.update(id, updatePayableDto);
  }
}

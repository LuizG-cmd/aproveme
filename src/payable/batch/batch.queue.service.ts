import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePayableDto } from '../dto/create-payable.dto';

interface batchData {
  id: string;
  payables: CreatePayableDto[];
  createdAt: Date;
}

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(private prisma: PrismaService) {}

  async processBatch(data: batchData) {
    this.logger.log(`Processing batch: ${data.id}`);

    for (const payableData of data.payables) {
      await this.savePayable(payableData);
      this.logger.log(`Saved payable for assignor ${payableData.assignorId}`);
    }
  }

  private async savePayable(payableData: CreatePayableDto) {
    const { value, emissionDate, assignorId } = payableData;

    /*const findAssignor = await this.prisma.payable.findFirst({
      where: { assignorId },
    });

    if (!findAssignor) {
      throw new BadRequestException('Invalid AssignorID');
    }*/

    await this.prisma.payable.create({
      data: {
        value,
        emissionDate: new Date(emissionDate),
        assignorId,
      },
    });
  }
}

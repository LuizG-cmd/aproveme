import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePayableDto } from '../dto/create-payable.dto';
import { EmailService } from 'src/email/email.service';

interface batchData {
  id: string;
  payables: CreatePayableDto[];
  createdAt: Date;
}

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async processBatch(data: batchData) {
    const result = {
      success: 0,
      failed: 0,
    };

    this.logger.log(`Processing batch: ${data.id}`);

    for (const payableData of data.payables) {
      try {
        await this.savePayable(payableData);
        this.logger.log(`Saved payable for assignor ${payableData.assignorId}`);
        result.success++;
      } catch (error) {
        result.failed++;
        this.logger.log(
          `Error saved payable ${error.message}, total faileds ${result.failed}`,
        );
      }
    }

    await this.emailService.sendMail(result);
  }

  private async savePayable(payableData: CreatePayableDto) {
    const { value, emissionDate, assignorId } = payableData;

    if (!value || !emissionDate || !assignorId) {
      throw new BadRequestException('Missing fields in payable data');
    }

    const assignor = await this.prisma.assignor.findFirst({
      where: {
        id: assignorId,
        deletedAt: null,
      },
    });

    if (!assignor) {
      throw new BadRequestException(
        `Assignor ${assignorId} not found or deleted`,
      );
    }

    await this.prisma.payable.create({
      data: {
        value,
        emissionDate: new Date(emissionDate),
        assignorId,
      },
    });
  }
}

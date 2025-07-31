import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Payable } from 'generated/prisma';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { BatchCreateDto } from './batch/batch.queue.dto';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PayableService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BATCH_SERVICES') private rabbitMq: ClientProxy,
  ) {}

  async create(data: CreatePayableDto): Promise<Payable> {
    try {
      const { value, emissionDate, assignorId } = data;

      if (!value || !emissionDate || !assignorId) {
        throw new BadRequestException('Is required');
      }

      const payable = await this.prisma.payable.create({
        data: { value, emissionDate: new Date(emissionDate), assignorId },
      });

      return payable;
    } catch (err) {
      throw new Error('Erro', err);
    }
  }

  createBatch(data: BatchCreateDto) {
    const id = uuidv4();
    const batch = {
      id: id,
      payables: data.payables,
      createdAt: new Date(),
    };

    this.rabbitMq.emit('batch_queue', batch);

    return batch.id;
  }

  async findAll(): Promise<Payable[]> {
    const payable = await this.prisma.payable.findMany();

    if (!payable) {
      throw new NotFoundException('Payable not found');
    }

    return payable;
  }

  async findOne(id: string): Promise<Payable> {
    const payable = await this.prisma.payable.findUnique({
      where: { id },
    });

    if (!payable) {
      throw new NotFoundException(`Payable ID not found`);
    }

    return payable;
  }

  async update(id: string, updatePayableDto: UpdatePayableDto) {
    const { value, emissionDate, assignorId } = updatePayableDto;

    const findPayable = await this.prisma.payable.findFirst({
      where: { id },
    });

    if (!findPayable) {
      throw new NotFoundException('Payable not found');
    } else {
      const updatePayable = await this.prisma.payable.update({
        where: { id },
        data: { value, emissionDate: new Date(emissionDate), assignorId },
      });

      return { message: 'Payable updated', Payable: updatePayable.id };
    }
  }

  async softDelete(id: string) {
    const findAssignor = await this.prisma.payable.findUnique({
      where: { id },
    });

    if (!findAssignor) {
      throw new BadRequestException('Payable not found');
    } else {
      const deletePayable = await this.prisma.payable.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        message: 'Payable deleted',
        PayableID: deletePayable.id,
      };
    }
  }
}

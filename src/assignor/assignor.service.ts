import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssignorService {
  constructor(private prisma: PrismaService) {}

  async create(createAssignorDto: CreateAssignorDto) {
    const { document, email, phone, name } = createAssignorDto;

    if (!document || !email || !phone || !name) {
      throw new BadRequestException('Is required');
    }

    return await this.prisma.assignor.create({
      data: { document, email, phone, name },
    });
  }

  async findAll() {
    const assignor = await this.prisma.assignor.findMany();

    if (!assignor) {
      throw new NotFoundException('Assignors not found');
    }

    return assignor;
  }

  async findOne(id: string) {
    const assignor = await this.prisma.assignor.findUnique({
      where: { id },
    });

    if (!assignor) {
      throw new NotFoundException(`Assignor ID not found`);
    }

    return assignor;
  }

  async update(id: string, updateAssignorDto: UpdateAssignorDto) {
    const { document, email, phone, name } = updateAssignorDto;

    const findAssignor = await this.prisma.assignor.findFirst({
      where: { id },
    });

    if (!findAssignor) {
      throw new NotFoundException('Payable not found');
    } else {
      const updateAssignor = await this.prisma.assignor.update({
        where: { id },
        data: { document, email, phone, name },
      });

      return updateAssignor;
    }
  }

  async softDelete(id: string) {
    try {
      const findAssignor = await this.prisma.assignor.findUnique({
        where: { id },
      });

      if (!findAssignor) {
        throw new BadRequestException('Assignor not found');
      }

      const assignor = await this.prisma.assignor.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return assignor;
    } catch (error) {
      throw new error(error.stack);
    }
  }
}

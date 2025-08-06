import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

    const existingAssignor = await this.prisma.assignor.findFirst({
      where: {
        OR: [{ document }, { email }],
      },
    });

    if (existingAssignor) {
      throw new BadRequestException('Assignor has been exists');
    }

    try {
      const assignor = await this.prisma.assignor.create({
        data: { document, email, phone, name },
      });

      return {
        Assignor: assignor.id,
        Email: assignor.email,
      };

      /*if (!document || !email || !phone || !name) {
      throw new BadRequestException('Is required');*/
    } catch {
      throw new InternalServerErrorException(`Internal server error`);
    }
  }

  async findAll() {
    try {
      const assignor = await this.prisma.assignor.findMany({
        where: { deletedAt: null },
      });

      if (!assignor) {
        throw new NotFoundException('Assignors not found');
      }

      return assignor;
    } catch (error) {
      throw new Error(`Internal server error ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const assignor = await this.prisma.assignor.findUnique({
        where: { id },
      });

      if (!assignor) {
        throw new NotFoundException(`Assignor ID not found`);
      }

      return assignor;
    } catch (error) {
      // Log do erro para observabilidade (em dev ou prod, dependendo da estratégia)
      console.error('Erro ao criar assignor:', error);

      throw new InternalServerErrorException('Erro ao criar assignor.');
    }
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
    const findAssignor = await this.prisma.assignor.findUnique({
      where: { id },
    });

    if (!findAssignor) {
      throw new NotFoundException('Assignor not found');
    }

    try {
      const assignor = await this.prisma.assignor.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return { message: 'Assignor excluded', assignorId: assignor.id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error(`Internal error deleting assignor: ${error.message}`);
    }
  }
}

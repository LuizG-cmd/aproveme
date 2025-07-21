import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthDto: CreateAuthDto) {
    const { login, password } = createAuthDto;

    if (!login || !password) {
      throw new BadRequestException('Is Required');
    }

    const user = await this.prisma.user.create({
      data: { login, password },
    });

    return user.id;
  }

  async auth(loginAuthDto: LoginAuthDto) {
    const { login, password } = loginAuthDto;

    const findUser = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!findUser || findUser?.password !== password) {
      throw new UnauthorizedException('User not found');
    } else {
      return { message: 'Success login', user: findUser.id };
    }
  }
}

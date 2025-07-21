import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
    }

    const payload = { findUser: findUser };

    return {
      access_token: await this.jwtService.signAsync(payload.findUser.id),
    };
  }
}

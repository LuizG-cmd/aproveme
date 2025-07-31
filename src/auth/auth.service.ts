import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

    const saltOrRounds = 10;

    const hashedpassword = await bcrypt.hash(password, saltOrRounds);

    const user = await this.prisma.user.create({
      data: { login, password: hashedpassword },
    });

    return { Userid: user.id };
  }

  async auth(loginAuthDto: LoginAuthDto) {
    const { login, password } = loginAuthDto;

    const findUser = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!findUser) {
      throw new UnauthorizedException('User not found');
    }

    const matchUser = await bcrypt.compare(
      password as string,
      findUser.password,
    );

    if (!matchUser) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload = { subject: findUser.id, login: findUser.login };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

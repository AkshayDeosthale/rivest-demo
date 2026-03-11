import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../../libs/prisma/src/prisma.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        gender: dto.gender,
      },
    });
    const { password: _pw, ...result } = user;
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return { user: result, access_token: token };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    const { password: _pw, ...result } = user;
    return result;
  }

  async login(user: { id: string; email: string }) {
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    const profile = await this.getProfile(user.id);
    return { user: profile, access_token: token };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        gender: true,
        createdAt: true,
      },
    });
    if (!user) return null;
    return user;
  }
}

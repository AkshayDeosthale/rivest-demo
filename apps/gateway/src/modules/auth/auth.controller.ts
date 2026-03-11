import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() _dto: LoginDto,
    @Req() req: { user: { id: string; email: string } },
  ) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: { id: string; email: string }) {
    return this.authService.getProfile(user.id);
  }
}

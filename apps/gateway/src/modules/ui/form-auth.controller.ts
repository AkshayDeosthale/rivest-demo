import { Controller, Post, Body, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from '../auth/dto/signup.dto';
import { LoginDto } from '../auth/dto/login.dto';

@Controller()
export class FormAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/signup-form')
  async signupForm(@Body() dto: SignupDto, @Res() res: Response) {
    try {
      await this.authService.signup(dto);
      return res.redirect(302, '/login?registered=1');
    } catch {
      return res.redirect(302, '/signup?error=1');
    }
  }

  @Post('auth/login-form')
  async loginForm(
    @Body() dto: LoginDto,
    @Query('redirect') redirect: string | undefined,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      return res.redirect(302, '/login?error=1');
    }
    const { access_token } = await this.authService.login(user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    return res.redirect(302, redirect || '/');
  }
}

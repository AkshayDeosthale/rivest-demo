import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ViewAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = (req.cookies as Record<string, string>)?.access_token;
    if (!token) {
      return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') ??
        'secret-key-change-in-production';
      this.jwtService.verify(token, { secret });
      next();
    } catch {
      return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
  }
}

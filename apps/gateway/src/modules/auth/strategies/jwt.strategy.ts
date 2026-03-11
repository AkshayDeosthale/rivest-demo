import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) =>
          (req?.cookies?.access_token as string | undefined) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('JWT_SECRET') ?? 'secret-key-change-in-production',
    });
  }

  validate(payload: { sub: unknown; email: unknown }): {
    id: string;
    email: string;
  } {
    return {
      id: String(payload.sub),
      email: String(payload.email),
    };
  }
}

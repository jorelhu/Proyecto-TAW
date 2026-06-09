/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_SECRETO_SUPER_SECRETO_CAMBIA_ESTO',
    });
  }

  async validate(payload: any) {
    // Al retornar esto, NestJS lo inyectará automáticamente en req.user
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role, // <-- Mapeado aquí para los Guards de rutas protegidas
    };
  }
}

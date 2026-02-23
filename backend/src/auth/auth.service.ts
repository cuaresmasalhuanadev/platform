import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async login(code: string) {
        const validCode = this.configService.get<string>('LOGIN_CODE');
        if (code !== validCode) {
            throw new UnauthorizedException('Código de acceso inválido');
        }
        const payload = { sub: 'admin', role: 'admin' };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

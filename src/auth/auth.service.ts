import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { packRules } from '@casl/ability/extra'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService,
        private abilityService: CaslAbilityService
    ) { }

    async login(login: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            where: { email: login.email }
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = bcrypt.compareSync(
            login.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const ability = this.abilityService.createForUser(user);

        const token = this.jwtService.sign({
            name: user.name,
            email: user.email,
            role: user.role,
            sub: user.id,
            permissions: packRules(ability.rules),
        });
        return { access_token: token };
    }
}

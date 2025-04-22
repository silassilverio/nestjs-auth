import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from 'generated/prisma/client';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<{
        name: string,
        email: string,
        role: Roles,
        sub: string,
        permissions: PrismaJson.PermissionsList
      }>(token, { algorithms: ['HS256'] });
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub }
      })
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      request.user = user
      this.abilityService.createForUser(user);
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token', { cause: error });
    }
  }
}
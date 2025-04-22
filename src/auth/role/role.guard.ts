import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles } from 'generated/prisma';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const RequiredRoles = this.reflector.get<Roles[]>(
      'roles',
      context.getHandler(),
    );

    if (!RequiredRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authUser = request.user;

    return authUser.role === Roles.ADMIN || RequiredRoles.includes(authUser.role);
  }
}

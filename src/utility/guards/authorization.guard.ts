import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from '../decorators/roles.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const allowedRoles = this.reflector.get<string[]>(AllowedRoles, context.getClass());
    const request = context.switchToHttp().getRequest();
    const result = request.currentUser?.roles?.map(
      (role: string) => allowedRoles.includes(role)).find(
        (val: boolean) => val === true);
    if (result) return true;
    throw new UnauthorizedException('User not authorized');
  }
}
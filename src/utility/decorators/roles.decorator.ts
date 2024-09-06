import { Reflector } from '@nestjs/core';

export const AllowedRoles = Reflector.createDecorator<string[]>();
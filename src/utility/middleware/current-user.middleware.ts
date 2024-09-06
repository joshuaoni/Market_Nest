import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      req.currentUser = null;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const currentUser = await this.userRepository.findOneBy({ id: +id });
        req.currentUser = currentUser;
      } catch {
        req.currentUser = null;
      }
    }
    next();
  }
}

interface JwtPayload {
  id: string;
}
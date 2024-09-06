import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findOneByEmail(userSignUpDto.email);
    if (userExists) throw new BadRequestException('Email is not available');
    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    let user = this.userRepository.create(userSignUpDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.userRepository.createQueryBuilder('users')
      .addSelect('users.password').where('users.email=:email', { email: userSignInDto.email }).getOne();
    if (!userExists) throw new BadRequestException('Wrong email or password');
    const comparePassword = await compare(userSignInDto.password, userExists.password);
    if (!comparePassword) throw new BadRequestException('Wrong email or password');
    delete userExists.password;
    return userExists;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async remove(currentUser: UserEntity) {
    return await this.userRepository.remove(currentUser);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }

  async getAccessAndRefreshToken(user: UserEntity): Promise<{ accessToken: string; refreshToken: string; }> {
    const accessToken = sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
    );
    const refreshToken = sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME }
    );
    return { accessToken, refreshToken };
  }

  async getAccessToken({ refreshToken }: { refreshToken: string }) {
    try {
      const { id } = <JwtPayload>verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
      const currentUser = await this.userRepository.findOneBy({ id: +id });
      if (!currentUser) throw new NotFoundException('User not found');
      const accessToken = sign(
        { id: currentUser.id, email: currentUser.email },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
      );
      return accessToken;
    } catch (err) {
      throw new UnauthorizedException('Refresh token expired');
    }
  }
}

interface JwtPayload {
  id: string;
}
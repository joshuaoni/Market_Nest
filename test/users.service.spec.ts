import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { UserEntity } from '../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserSignUpDto } from '../src/users/dto/user-signup.dto';
import { UserSignInDto } from '../src/users/dto/user-signin.dto';
import { Roles } from 'src/utility/common/user-roles.enum';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  const mockedUser: UserEntity = {
    id: 1,
    name: 'Joshua Oni',
    email: 'davidjoshua603@gmail.com',
    password: '12345',
    roles: [Roles.ADMIN],
    createdAt: new Date(),
    updatedAt: new Date(),
    category: [],
    products: [],
    reviews: [],
    orders: []
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const userSignUpDto: UserSignUpDto = {
      name: 'Joshua Oni',
      email: 'davidjoshua603@gmail.com',
      password: '12345',
    };
    it('should signup a new user', async () => {
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(mockedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockedUser);

      const result = await service.signup(userSignUpDto);
      expect(result).toEqual(mockedUser);
      expect(userRepository.create).toHaveBeenCalledWith({ ...userSignUpDto, password: 'hashedPassword' });
      expect(service.findOneByEmail).toHaveBeenCalledWith('davidjoshua603@gmail.com');
      expect(userRepository.save).toHaveBeenCalledWith(mockedUser);
    });


    it('should throw error if email is already taken on signup', async () => {
      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(mockedUser);

      await expect(service.signup(userSignUpDto)).rejects.toThrow(BadRequestException);
    });
  })

  describe('signin', () => {
    const userSignInDto: UserSignInDto = {
      email: 'davidjoshua603@gmail.com',
      password: '12345',
    };
    it('should signin a user with correct credentials', async () => {
      jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockedUser),
      } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.signin(userSignInDto);
      expect(result).toEqual(mockedUser);
    });

    it('should throw error on invalid credentials for signin', async () => {
      const userEntity: UserEntity = { id: 1, email: 'test@example.com', password: 'hashedpassword' } as UserEntity;

      jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(userEntity),
      } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.signin(userSignInDto)).rejects.toThrow(BadRequestException);
    });
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: UserEntity[] = [
        {
          id: 1,
          name: 'Joshua Oni',
          email: 'davidjoshua603@gmail.com',
          password: '12345',
          roles: [Roles.ADMIN],
          createdAt: new Date(),
          updatedAt: new Date(),
          category: [],
          products: [],
          reviews: [],
          orders: []
        },
        {
          id: 2,
          name: 'Dante Olagbenro',
          email: 'olagbenro@gmail.com',
          password: '12345',
          roles: [Roles.USER],
          createdAt: new Date(),
          updatedAt: new Date(),
          category: [],
          products: [],
          reviews: [],
          orders: []
        }
      ]

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  })

  describe('remove', () => {
    it('should delete a user', async () => {
      const currentUser = mockedUser;

      jest.spyOn(userRepository, 'remove').mockResolvedValue(currentUser);

      const result = await service.remove(currentUser);
      expect(result).toEqual(currentUser);
      expect(userRepository.remove).toHaveBeenCalledWith(currentUser);
    });
  })

  describe('getAccessAndRefreshToken', () => {
    it('should return access and refresh tokens', async () => {
      const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      jest.spyOn(jwt, 'sign').mockImplementation(() => 'refresh-token')
        .mockImplementationOnce(() => 'access-token');

      const result = await service.getAccessAndRefreshToken(mockedUser);
      expect(result).toEqual(tokens);
    });
  })

  describe('getAccessToken', () => {
    it('should return a new access token using a refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const currentUser = mockedUser;

      jest.spyOn(jwt, 'verify').mockReturnValue({ id: 1 } as unknown as ReturnType<any>); // Mock JWT verify
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(currentUser);
      jest.spyOn(jwt, 'sign').mockReturnValue('new-access-token' as unknown as ReturnType<any>);

      const result = await service.getAccessToken({ refreshToken });
      expect(result).toEqual('new-access-token');
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if refresh token is invalid or expired', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new UnauthorizedException('Refresh token expired');
      });

      await expect(service.getAccessToken({ refreshToken: 'invalid-token' })).rejects.toThrow(UnauthorizedException);
    });
  })
});


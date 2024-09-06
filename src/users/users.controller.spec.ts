import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserEntity } from './entities/user.entity';
import { Roles } from 'src/utility/common/user-roles.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            findAll: jest.fn(),
            remove: jest.fn(),
            getAccessToken: jest.fn(),
            getAccessAndRefreshToken: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
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
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should signup a new user', async () => {
      const userSignUpDto: UserSignUpDto = {
        name: 'Joshua Oni',
        email: 'davidjoshua603@gmail.com',
        password: '12345',
      };

      jest.spyOn(usersService, 'signup').mockResolvedValue(mockedUser);

      expect(await controller.signup(userSignUpDto)).toEqual(mockedUser);
      expect(usersService.signup).toHaveBeenCalledWith(userSignUpDto);
    });
  })

  describe('signin', () => {
    it('should signin a user and return tokens', async () => {
      const userSignInDto: UserSignInDto = {
        email: 'davidjoshua603@gmail.com',
        password: '12345',
      };
      const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      jest.spyOn(usersService, 'signin').mockResolvedValue(mockedUser);
      jest.spyOn(usersService, 'getAccessAndRefreshToken').mockResolvedValue(tokens);

      const result = await controller.signin(userSignInDto);
      expect(result).toEqual({ ...tokens, user: mockedUser });
      expect(usersService.signin).toHaveBeenCalledWith(userSignInDto);
      expect(usersService.getAccessAndRefreshToken).toHaveBeenCalledWith(mockedUser);
    });
  })

  describe('profile', () => {
    it('should return the current user profile', () => {
      const currentUser = mockedUser;

      expect(controller.getProfile(currentUser)).toEqual(currentUser);
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

      jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  })

  describe('remove', () => {
    it('should delete the current user', async () => {
      const currentUser = mockedUser;

      jest.spyOn(usersService, 'remove').mockResolvedValue(currentUser);

      expect(await controller.remove(currentUser)).toEqual(currentUser);
      expect(usersService.remove).toHaveBeenCalledWith(currentUser);
    });
  })

  describe('getAccessToken', () => {
    it('should return a new access token using valid refresh token', async () => {
      const refreshToken = 'some-refresh-token';
      const accessToken = 'new-access-token';

      jest.spyOn(usersService, 'getAccessToken').mockResolvedValue(accessToken);

      expect(await controller.getAccessToken({ refreshToken })).toEqual(accessToken);
      expect(usersService.getAccessToken).toHaveBeenCalledWith({ refreshToken });
    });
  })
});

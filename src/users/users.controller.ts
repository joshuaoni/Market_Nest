import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AllowedRoles } from 'src/utility/decorators/roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';

@AllowedRoles([Roles.ADMIN])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  async signup(@Body() userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    return await this.usersService.signup(userSignUpDto);
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
  }> {
    const user = await this.usersService.signin(userSignInDto);
    const { accessToken, refreshToken } = await this.usersService.getAccessAndRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Delete('profile/delete')
  async remove(@CurrentUser() currentUser: UserEntity) {
    return await this.usersService.remove(currentUser);
  }

  @Post('refresh')
  getAccessToken(@Body() { refreshToken }: { refreshToken: string }) {
    return this.usersService.getAccessToken({ refreshToken });
  }
}

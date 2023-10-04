import { Body, Controller, Get, Headers, Post, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { CreateInterceptor, TransformInterceptor } from 'src/core/transform.interceptor';
import { Response, Request } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private roleService: RolesService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @UseInterceptors(TransformInterceptor)
    @ResponseMessage("Login user")
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response)
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    @UseInterceptors(CreateInterceptor)
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto)
    }

    @Get('profile')
    @UseInterceptors(CreateInterceptor)
    @ResponseMessage("Register a new user")
    getProfile(@Req() req) {
        return req.user;
    }

    @Get('account')
    @ResponseMessage("Get user information")
    @UseInterceptors(TransformInterceptor)
    async getAccountfromHeader(@UserDecorate() user: IUser) {
        const temp = await this.roleService.findOne(user.role._id) as any
        user.permissions = temp.permissions
        return { user };
    }

    @Public()
    @Get('refresh')
    @ResponseMessage("Get user information")
    handleRefreshToken(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response) {
        const refresh_Token = request.cookies['refresh_token']
        return this.authService.processNewToken(refresh_Token, response);
    }

    @ResponseMessage("Logout user")
    @Post('logout')
    @UseInterceptors(TransformInterceptor)
    handleLogout(
        @UserDecorate() user: IUser,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.logout(user, response)
    }
}

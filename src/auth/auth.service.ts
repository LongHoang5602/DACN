import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { async } from 'rxjs';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private roleService: RolesService,
        // @InjectModel(User.name)
        // private userModel: SoftDeleteModel<UserDocument>
    ) { }

    //username/ pass là 2 tham số thư viện passport nó ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid) {
                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.roleService.findOne(userRole._id)
                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }
                return objUser;
            } else {
                return null;
            }
        }

    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refresh_token = this.getRefresh_token(payload)
        await this.usersService.updateRefresh_Token(_id, refresh_token)
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 36000
        })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            },
        };
    }

    async register(registerUserDto: RegisterUserDto) {

        const user = await this.usersService.register({
            email: registerUserDto.email,
            password: registerUserDto.password,
            name: registerUserDto.name,
            address: registerUserDto.address,
            gender: registerUserDto.gender,
            age: registerUserDto.age,
            role: "USER"
        })
        return user;
    }
    getRefresh_token = (payload) => {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRED')
        })
    }
    processNewToken = async (refresh_Token: string, response: Response) => {
        try {
            this.jwtService.verify(refresh_Token, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            })
            const user = await this.usersService.findUserbyToken(refresh_Token)
            const { _id, name, email, role } = user;
            const payload = {
                sub: "token login",
                iss: "from server",
                _id,
                name,
                email,
                role
            };
            const refresh_token = this.getRefresh_token(payload)
            await this.usersService.updateRefresh_Token(_id, refresh_token)
            const userRole = user.role as unknown as { _id: string; name: string }
            const temp = await this.roleService.findOne(userRole._id)
            response.clearCookie("refresh_token")
            response.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: 36000
            })
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    _id,
                    name,
                    email,
                    role,
                    permissions: temp?.permissions ?? []
                }
            };
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ . Vui lòng đăng nhập lại")
        }
    }
    logout = async (user: IUser, response: Response) => {
        this.usersService.updateRefresh_Token(user._id, "")
        response.clearCookie("refresh_token")
        return "Ok"
    }
}

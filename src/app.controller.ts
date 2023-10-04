import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { Public } from './decorator/customize';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,//khai báo biến .env thông qua constructor
  ) { }

  @Get()
  @Render('home')
  getHello() {
    console.log(">>>>> Check port : ", this.configService.get<string>("PORT"))
    const mess = this.appService.getHello()
    return {
      mess: mess
    }
  }
}

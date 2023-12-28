import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { CreateInterceptor, TransformInterceptor } from 'src/core/transform.interceptor';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  @ResponseMessage("Create a new user")
  @UseInterceptors(CreateInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage("Find all users")
  @UseInterceptors(TransformInterceptor)
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Get a user")
  @UseInterceptors(TransformInterceptor)
  @Public()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a user")
  @UseInterceptors(TransformInterceptor)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UserDecorate() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")
  @UseInterceptors(TransformInterceptor)
  remove(@Param('id') id: string, @UserDecorate() user: IUser) {
    return this.usersService.remove(id, user);
  }
}

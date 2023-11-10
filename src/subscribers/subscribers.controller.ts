import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { CreateInterceptor, TransformInterceptor } from 'src/core/transform.interceptor';
import { ResponseMessage, SkipCheckPermission, UserDecorate } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @UseInterceptors(CreateInterceptor)
  @ResponseMessage("Create Role")
  create(@Body() createSubscriberDto: CreateSubscriberDto, @UserDecorate() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Post("skills")
  @SkipCheckPermission()
  @ResponseMessage("Get subcriber skill")
  getUserSkill(@UserDecorate() user: IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get all Role")
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get a Role")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Update a Role")
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @UserDecorate() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Delete a Role")
  remove(@Param('id') id: string, @UserDecorate() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreateInterceptor, TransformInterceptor } from 'src/core/transform.interceptor';
import { ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @UseInterceptors(CreateInterceptor)
  @ResponseMessage("Create Permission")
  create(@Body() createPermissionDto: CreatePermissionDto, @UserDecorate() user: IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage("Get all permissions")
  @UseInterceptors(TransformInterceptor)
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Get a permission")
  @UseInterceptors(TransformInterceptor)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update permission")
  @UseInterceptors(TransformInterceptor)
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @UserDecorate() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete permission")
  @UseInterceptors(TransformInterceptor)
  remove(@Param('id') id: string, @UserDecorate() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateInterceptor, TransformInterceptor } from 'src/core/transform.interceptor';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @UseInterceptors(CreateInterceptor)
  @ResponseMessage("Create Role")
  create(@Body() createRoleDto: CreateRoleDto, @UserDecorate() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get all Role")
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get a Role")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Update a Role")
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @UserDecorate() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Delete a Role")
  remove(@Param('id') id: string, @UserDecorate() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}

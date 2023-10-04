import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateCVDto, CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateInterceptor, TransformInterceptor } from 'src/core/transform.interceptor';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @UseInterceptors(CreateInterceptor)
  @ResponseMessage("Create CV")
  create(
    @Body() createCVDto: CreateCVDto,
    @UserDecorate() user: IUser) {
    return this.resumesService.create(createCVDto, user);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get all CV")
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get CV by Id")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Post('by-user')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get CV by UserId")
  findCVbyUserId(@UserDecorate() user: IUser) {
    return this.resumesService.findCVbyUserId(user);
  }

  @Patch(':id')
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Update CV by Id")
  update(@Param('id') id: string, @Body("status") status: string, @UserDecorate() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecorate() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}

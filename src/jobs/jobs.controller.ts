import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateInterceptor, TransformInterceptor } from 'src/core/transform.interceptor';
import { Public, ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Create a new job")
  @UseInterceptors(CreateInterceptor)
  create(
    @Body() createJobDto: CreateJobDto,
    @UserDecorate() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @ResponseMessage("Get all jobs")
  @UseInterceptors(TransformInterceptor)
  @Public()
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Get a job")
  @UseInterceptors(TransformInterceptor)
  @Public()
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update job")
  @UseInterceptors(TransformInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @UserDecorate() user: IUser) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete job")
  @UseInterceptors(TransformInterceptor)
  remove(
    @Param('id') id: string,
    @UserDecorate() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}

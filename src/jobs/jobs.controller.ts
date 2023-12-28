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
    @Query() qs: string,
    @Query('locations') locations?: string,
    @Query('skills') skills?: string) {
    if (skills && skills.length > 0) {
      const skillsArray: string[] = JSON.parse(skills);
      if (locations) {
        const locationArray: string[] = JSON.parse(locations);
        return this.jobsService.findAll(+currentPage, +limit, qs, skillsArray, locationArray);
      }
      return this.jobsService.findAll(+currentPage, +limit, qs, skillsArray);

    }
    if (locations) {
      const locationArray: string[] = JSON.parse(locations);
      return this.jobsService.findAll(+currentPage, +limit, qs, undefined, locationArray);
    }
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get('analyzelevel')
  @ResponseMessage("Get a analyzeLevel")
  @UseInterceptors(TransformInterceptor)
  @Public()
  analyzeLevel() {
    return this.jobsService.analyzeLevel();
  }

  @Get('analyzeskill')
  @ResponseMessage("Get a analyzeskill")
  @UseInterceptors(TransformInterceptor)
  @Public()
  analyzeSkill() {
    return this.jobsService.analyzeSkill();
  }

  @Get("find")
  @UseInterceptors(TransformInterceptor)
  @ResponseMessage("Get jobs")
  @Public()
  findValue(@Query('skills') skills?: string[], @Query('location') location?: string) {
    if (skills && skills.length > 0) {
      if (location) {
        return this.jobsService.findValue(skills, location);
      }
      return this.jobsService.findValue(skills);

    }
    if (location) {
      return this.jobsService.findValue(undefined, location);
    }
    return this.jobsService.findValue();
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

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { UserDecorate } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('learner')
export class LearnerController {
  constructor(private readonly learnerService: LearnerService) { }

  @Post()
  create(@Body() createLearnerDto: CreateLearnerDto, @UserDecorate() user: IUser) {
    return this.learnerService.create(createLearnerDto, user);
  }

  @Get()
  findAll() {
    return this.learnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learnerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearnerDto: UpdateLearnerDto) {
    return this.learnerService.update(+id, updateLearnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learnerService.remove(+id);
  }
}

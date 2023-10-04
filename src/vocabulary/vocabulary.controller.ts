import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) { }

  @Post()
  create(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Get()
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string) {
    return this.vocabularyService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocabularyDto: UpdateVocabularyDto) {
    return this.vocabularyService.update(+id, updateVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(+id);
  }
}

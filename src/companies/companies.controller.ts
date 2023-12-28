import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { TransformInterceptor } from 'src/core/transform.interceptor';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ResponseMessage("Create Company")
  create(@Body() createCompanyDto: CreateCompanyDto, @UserDecorate() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Get all companies")
  @UseInterceptors(TransformInterceptor)
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string

  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("Get a company")
  @UseInterceptors(TransformInterceptor)
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Delete(':id')
  @ResponseMessage("Delete a company")
  @UseInterceptors(TransformInterceptor)
  remove(@Param('id') id: string, @UserDecorate() user: IUser) {
    return this.companiesService.remove(id, user);
  }

  @Patch(':id')
  @ResponseMessage("Patch a company")
  @UseInterceptors(TransformInterceptor)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @UserDecorate() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }


}

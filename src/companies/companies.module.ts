import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { JobsService } from 'src/jobs/jobs.service';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),],
  controllers: [CompaniesController],
  providers: [CompaniesService, JobsService],
  exports: [CompaniesService]
})
export class CompaniesModule { }

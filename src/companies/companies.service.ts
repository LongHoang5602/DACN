import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const company = await this.companyModel.create({
      ...createCompanyDto, createdBy: {
        _id: user._id,
        email: user.email,
      }
    })
    return company;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);
    let { sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.companyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found company`);
    return await this.companyModel.findById(id);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.findByIdAndUpdate(id, {
      ...updateCompanyDto, updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `Not found company`;
    await this.companyModel.findByIdAndUpdate(id, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    const jobInCompany = await this.jobModel.find()
    jobInCompany.filter((item) => {
      if (item.company._id.toString() == id) {
        this.jobModel.softDelete({
          _id: item._id
        })
      }
    })
    return this.companyModel.softDelete({
      _id: id
    })
  }
}

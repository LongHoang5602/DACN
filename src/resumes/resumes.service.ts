import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCVDto, CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import mongoose, { Mongoose } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import { ObjectId } from "mongoose";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }
  async create(createCVDto: CreateCVDto, user: IUser) {
    const resume = await this.resumeModel.create({
      userId: user._id,
      email: user.email,
      url: createCVDto.url,
      status: "PENDING",
      companyId: createCVDto.companyId,
      jobId: createCVDto.jobId,
      history: {
        status: "PENDING",
        updatedAt: new Date,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return resume;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);
    let { sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    // result.forEach((user) => {
    //   user.password = undefined;         // để loại bỏ trường password ra khỏi kết quả tìm được
    // });
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found resume`);
    }
    return await this.resumeModel.findById(id);
  }

  async findCVbyUserId(user: IUser) {

    return await this.resumeModel.find({ userId: user._id }).sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: { name: 1 }
        },
        {
          path: "jobId",
          select: { name: 1 }
        }
      ]);
  }

  async update(id: string, status: string, user: IUser) {

    return await this.resumeModel.updateOne({
      _id: id
    }, {
      status: status,
      updatedAt: new Date,
      updatedBy: {
        _id: user._id,
        name: user.email
      },
      $push: {
        history: {
          status: status,
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            name: user.email
          }
        }
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found resume`;
    await this.resumeModel.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        name: user.email
      }
    })
    return this.resumeModel.softDelete({
      _id: id
    })
  }
}

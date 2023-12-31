import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }
  async create(createJobDto: CreateJobDto, user: IUser) {
    const job = await this.jobModel.create({
      name: createJobDto.name,
      skills: createJobDto.skills,
      company: createJobDto.company,
      location: createJobDto.location,
      salary: createJobDto.salary,
      quantity: createJobDto.quantity,
      level: createJobDto.level,
      description: createJobDto.description,
      startDate: createJobDto.startDate,
      endDate: createJobDto.endDate,
      isActive: createJobDto.isActive,
    })
    await this.jobModel.findByIdAndUpdate(job._id, {
      createdBy: {
        _id: user._id,
        name: user.email
      }
    })
    return job
  }

  async findAll(currentPage: number, limit: number, qs: string, skills?: string[], locations?: string[]) {

    const { filter, projection, population } = aqp(qs);
    let { sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    const d = await this.jobModel.find()

    if (skills !== undefined) {
      const resSkills = d.filter((item) => {
        for (let i = 0; i < item.skills.length; i++) {
          if (skills.includes(item.skills[i])) {
            return item
          }
        }
      })
      if (locations !== undefined) {
        const resBoth = resSkills.filter((item) => {
          if (locations.includes(item.location)) {
            return item
          }
        })
        return {
          meta: {
            current: currentPage, //trang hiện tại
            pageSize: limit, //số lượng bản ghi đã lấy
            pages: totalPages, //tổng số trang với điều kiện query
            total: totalItems // tổng số phần tử (số bản ghi)
          },
          result: resBoth
        }
      }
      return {
        meta: {
          current: currentPage, //trang hiện tại
          pageSize: limit, //số lượng bản ghi đã lấy
          pages: totalPages, //tổng số trang với điều kiện query
          total: totalItems // tổng số phần tử (số bản ghi)
        },
        result: resSkills
      }
    }
    if (locations !== undefined) {
      const resLocation = d.filter((item) => {
        if (locations.includes(item.location)) {
          return item
        }
      })
      return {
        meta: {
          current: currentPage, //trang hiện tại
          pageSize: limit, //số lượng bản ghi đã lấy
          pages: totalPages, //tổng số trang với điều kiện query
          total: totalItems // tổng số phần tử (số bản ghi)
        },
        result: resLocation
      }
    }


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result: result
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found job`);
    return await this.jobModel.findById({ _id: id });
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    return await this.jobModel.findByIdAndUpdate(id, {
      ...updateJobDto, updatedBy: {
        _id: user._id,
        name: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.findByIdAndUpdate(id, {
      deletedBy: {
        _id: user._id,
        name: user.email
      }
    })
    return await this.jobModel.softDelete({ _id: id });
  }

  async analyzeLevel() {
    const res = await this.jobModel.find()
    const result = {};
    for (const obj of res) {
      const key = obj.level;
      const count = result[key] || 0;
      result[key] = count + 1;
    }

    return result
  }
  async analyzeSkill() {
    const res = await this.jobModel.find()
    const result = {};
    for (const obj of res) {
      for (let i = 0; i < obj.skills.length; i++) {
        const key = obj.skills[i];
        const count = result[key] || 0;
        result[key] = count + 1;
      }
    }
    for (const [key, value] of Object.entries(result)) {
      if (key === "BACKEND") {
        console.log(value)
      }
    }

    return result
  }

  async findValue(skills?: string[], location?: string) {
    const d = await this.jobModel.find()

    if (skills !== undefined) {
      const resSkills = d.filter((item) => {
        for (let i = 0; i < item.skills.length; i++) {
          if (skills.includes(item.skills[i])) {
            return item
          }
        }
      })
      if (location) {
        const resBoth = resSkills.filter((item) => {
          if (location == item.location) {
            return item
          }
        })
        return resBoth
      }
      return resSkills
    }
    if (location) {
      const resLocation = d.filter((item) => {
        if (location == item.location) {
          return item
        }
      })
      return resLocation
    }


    return {}
  }
}

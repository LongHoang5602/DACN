import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SubscriberDocument } from './schemas/subscriber.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) { }
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const isExistName = await this.subscriberModel.findOne({
      email: createSubscriberDto.email
    })
    if (isExistName !== null) {
      throw new BadRequestException(`Đã tồn tại ${createSubscriberDto.email}`)
    } else {
      return await this.subscriberModel.create({
        ...createSubscriberDto, createdBy: {
          _id: user._id,
          email: user.email
        }
      });
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, population } = aqp(qs);
    let { sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.subscriberModel.find(filter)
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
      throw new BadRequestException(`Not found subcriber`);

    return await this.subscriberModel.findOne({
      _id: id
    })
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {

    return await this.subscriberModel.updateOne({
      email: user.email
    }, {
      ...updateSubscriberDto,
      updatedBy: {
        _id: user._id,
        name: user.email
      }
    },
      { upsert: true }
    );
  }

  async remove(id: string, user: IUser) {

    if (!mongoose.Types.ObjectId.isValid(id))
      return `Not found Subscriber`;
    await this.subscriberModel.updateOne({
      _id: id, deletedBy: {
        _id: user._id,
        name: user.email
      }
    })
    return this.subscriberModel.softDelete({
      _id: id
    })
  }
  async getSkills(user: IUser) {
    const { email } = user
    return await this.subscriberModel.findOne({ email }, { skills: 1 })
  }
}

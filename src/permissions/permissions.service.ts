import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const permission = await this.permissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
    })
    if (permission !== null) {
      throw new BadRequestException(`Đã có apiPath:${createPermissionDto.apiPath} và method:${createPermissionDto.method} trong database `)
    } else {
      return await this.permissionModel.create({
        ...createPermissionDto, createdBy: {
          _id: user._id,
          email: user.email,
        }
      });
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);
    let { sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.permissionModel.find(filter)
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
      throw new BadRequestException(`Not found permission`);
    return await this.permissionModel.findOne({
      _id: id
    })
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    const permission = await this.permissionModel.findOne({
      apiPath: updatePermissionDto.apiPath,
      method: updatePermissionDto.method,
    })
    if (permission._id.toString() !== id) {
      if (permission !== null) {
        throw new BadRequestException(`Đã có apiPath:${updatePermissionDto.apiPath} và method:${updatePermissionDto.method} trong database `)
      }
    }
    console.log(updatePermissionDto)
    return await this.permissionModel.updateOne({
      _id: id,
      apiPath: updatePermissionDto.apiPath,
      name: updatePermissionDto.name,
      method: updatePermissionDto.method,
      module: updatePermissionDto.module,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    });
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne({
      _id: id,
      deletedBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return await this.permissionModel.softDelete({ _id: id });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) { }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isExistName = await this.roleModel.findOne({
      name: createRoleDto.name
    })
    if (isExistName !== null) {
      throw new BadRequestException(`Đã tồn tại ${createRoleDto.name}`)
    } else {
      return await this.roleModel.create({
        ...createRoleDto, createdBy: {
          _id: user._id,
          email: user.email
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

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.roleModel.find(filter)
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

    return await this.roleModel.findOne({
      _id: id
    }).populate({
      path: "permissions",
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
    })
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const isExistName = await this.roleModel.findOne({
      name: updateRoleDto.name
    })
    if (isExistName._id.toString() !== id) {
      if (isExistName !== null) {
        throw new BadRequestException(`Đã tồn tại ${updateRoleDto.name}`)
      }
    }
    return await this.roleModel.updateOne({
      _id: id, ...updateRoleDto,
      updatedBy: {
        _id: user._id,
        name: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    const findRole = await this.roleModel.findById(id)
    if (findRole.name === ADMIN_ROLE) {
      throw new BadRequestException("Không được phép xóa role admin")
    }
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found role`;
    await this.roleModel.updateOne({
      _id: id, deletedBy: {
        _id: user._id,
        name: user.email
      }
    })
    return this.roleModel.softDelete({
      _id: id
    })
  }
}

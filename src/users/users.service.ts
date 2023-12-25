import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { IUser } from './users.interface';
import { ResponseMessage, UserDecorate } from 'src/decorator/customize';
import { isEmpty } from 'class-validator';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';
import aqp from 'api-query-params';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    // const isValidEmail = this.userModel.findOne({ email: createUserDto.email })
    // if (isValidEmail) {
    //   throw new BadRequestException(`Email ${createUserDto.email} đã tồn tại`)
    // }
    const hashPassword = this.getHashPassword(createUserDto.password);

    const user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      address: createUserDto.address,
      gender: createUserDto.gender,
      age: createUserDto.age,
      role: createUserDto.role,
    })
    return user;
  }
  async register(registerUserDto: RegisterUserDto) {

    const isValidEmail = this.userModel.findOne({ email: registerUserDto.email })
    // if (isValidEmail !== undefined) {
    //   throw new BadRequestException(`Email ${registerUserDto.email} đã tồn tại`)
    // }
    const userRole = await this.roleModel.findOne({ name: USER_ROLE })
    const hashPassword = this.getHashPassword(registerUserDto.password);

    const user = await this.userModel.create({
      email: registerUserDto.email,
      password: hashPassword,
      name: registerUserDto.name,
      address: registerUserDto.address,
      gender: registerUserDto.gender,
      age: registerUserDto.age,
      role: userRole._id
    })
    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);
    let { sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select("-password")  // để loại bỏ trường password ra khỏi kết quả tìm được
      .populate(population)
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
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found user`);


    return await this.userModel.findOne({
      _id: id
    }).select("-password")
      .populate({ path: "role", select: { name: 1, _id: 1 } })
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({ path: "role", select: { name: 1 } })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({
      _id: updateUserDto._id
    }, {
      ...updateUserDto, updatedBy: {
        _id: user._id,
        name: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    const findUser = await this.userModel.findById(id)
    if (findUser && findUser.email === "admin@gmail.com") {
      throw new BadRequestException("Không được phép xóa user admin")
    }
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;
    await this.userModel.updateOne({
      _id: id, deletedBy: {
        _id: user._id,
        name: user.email
      }
    })
    return this.userModel.softDelete({
      _id: id
    })
  }
  updateRefresh_Token = async (id, refreshToken) => {
    return await this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken
    })
  }
  findUserbyToken = async (refresh_token: string) => {
    return await this.userModel.findOne({
      refreshToken: refresh_token
    }).populate({ path: "role", select: { name: 1 } })
  }
}

import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator"
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateUserDto {
    @IsEmail({}, { message: "Không phải định dạng email" })
    email: string

    @IsNotEmpty({ message: "Password không được để trống" })
    password: string

    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string

    @IsNotEmpty({ message: "Tuổi không được để trống" })
    age: number

    @IsNotEmpty({ message: "Giới tính không được để trống" })
    gender: string

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company

    @IsNotEmpty({ message: "Chức vụ không được để trống" })
    @IsMongoId({ message: "Sai định dạng" })
    role: mongoose.Schema.Types.ObjectId

}
export class RegisterUserDto {
    @IsEmail({}, { message: "Không phải định dạng email" })
    email: string

    @IsNotEmpty({ message: "Password không được để trống" })
    password: string

    @IsNotEmpty({ message: "Password không được để trống" })
    name: string

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string

    @IsNotEmpty({ message: "Tuổi không được để trống" })
    age: number

    @IsNotEmpty({ message: "Giới tính không được để trống" })
    gender: string

    role: string
}

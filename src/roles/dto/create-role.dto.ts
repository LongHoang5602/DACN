import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator"
import mongoose from "mongoose"

export class CreateRoleDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    description: string

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    @IsBoolean({ message: "Phải mang giá trị boolean" })
    isActive: boolean

    @IsArray({ message: "Sai định dạng" })
    @IsMongoId({ each: true, message: "Sai kiểu dữ liệu" })
    @IsArray({ message: "Phải có định dạng là array" })
    permissions: mongoose.Schema.Types.ObjectId[]
}

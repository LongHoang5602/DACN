import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from "class-validator"
import mongoose from "mongoose";
import { isStringObject } from "util/types";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string

    @IsArray()
    @IsString({ each: true, message: "Kĩ năng phải là dạng chuỗi" })
    @ArrayMinSize(1)
    @IsNotEmpty({ message: "Kĩ năng không được để trống" })
    skills: string[]

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    location: string

    @IsNumber({}, { message: "Không đúng định dạng số" })
    @IsNotEmpty({ message: "Mức lương không được để trống" })
    salary: number

    @IsNumber({}, { message: "Không đúng định dạng số" })
    @IsNotEmpty({ message: "Số lượng không được để trống" })
    quantity: number

    @IsNotEmpty({ message: "Trình độ yêu cầu tính không được để trống" })
    level: string

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    description: string

    @IsNotEmpty({ message: "Ngày bắt đầu không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate()
    startDate: Date

    @IsNotEmpty({ message: "Ngày kết thúc không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate()
    endDate: Date

    @IsBoolean({ message: "Không đúng định dạng" })
    isActive: boolean

}

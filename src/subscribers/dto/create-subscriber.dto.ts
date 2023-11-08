import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateSubscriberDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    @IsEmail({}, { message: "Email sai định dạng" })
    email: string

    @IsNotEmpty({ message: "Kĩ năng không được để trống" })
    @IsArray({ message: "Sai định dạng" })
    @IsString({ each: true, message: "Sai định dạng" })
    skills: string[]


}

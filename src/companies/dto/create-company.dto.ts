import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateCompanyDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string

    @IsNotEmpty({ message: "Thông tin không được để trống" })
    description: string

    @IsNotEmpty({ message: "Logo không được để trống" })
    logo: string
}

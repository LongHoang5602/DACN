import { IsEmail, IsMongoId, IsNotEmpty } from "class-validator"

export class CreateResumeDto {

    @IsEmail({}, { message: "Không phải định dạng email" })
    email: string

    @IsMongoId({ message: "Sai định dạng" })
    @IsNotEmpty({ message: "UserId không được để trống" })
    userId: string

    status: string

    @IsNotEmpty({ message: "Url không được để trống" })
    url: string

    @IsMongoId({ message: "Sai định dạng" })
    @IsNotEmpty({ message: "CompanyId không được để trống" })
    companyId: string

    @IsMongoId({ message: "Sai định dạng" })
    @IsNotEmpty({ message: "JobId không được để trống" })
    jobId: string

}
export class CreateCVDto {

    @IsNotEmpty({ message: "Url không được để trống" })
    url: string

    @IsNotEmpty({ message: "CompanyId không được để trống" })
    @IsMongoId({ message: "Sai định dạng" })
    companyId: string

    @IsMongoId({ message: "Sai định dạng" })
    @IsNotEmpty({ message: "JobId không được để trống" })
    jobId: string

}

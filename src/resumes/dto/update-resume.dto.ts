import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
class UpdatedBy {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
class History {
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    updatedAt: Date;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy
}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: "Không được để trống" })
    @IsArray({ message: "Không đúng định dạng" })
    @ValidateNested()
    @Type(() => History)
    history: History[];
}

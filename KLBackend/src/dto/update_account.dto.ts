import { IsOptional, IsString, IsNumber } from 'class-validator';
import { IsNull } from 'typeorm';

export class UpdateAccountDto {
    // @IsNumber()
    // userId: number;

    @IsOptional()
    @IsString()
    display_name?: string;

    @IsOptional()
    @IsString()
    sex?: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}

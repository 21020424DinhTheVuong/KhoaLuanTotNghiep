import { IsString, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDto {
    @IsString()
    book_name: string;

    @IsString()
    other_name: string;

    @IsString()
    artist: string;

    @IsString()
    nation: string;

    @IsString()
    status: string;

    @IsString()
    description: string;

}

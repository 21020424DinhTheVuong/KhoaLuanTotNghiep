import { IsString, IsInt, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddBookDto {
    @IsNotEmpty()
    @IsString()
    book_name: string;

    @IsString()
    other_name: string;

    @IsNotEmpty()
    @IsString()
    artist: string;

    @IsNotEmpty()
    @IsArray()
    genre: number[];

    @IsNotEmpty()
    @IsString()
    nation: string;

    @IsNotEmpty()
    @IsString()
    description: string;

}
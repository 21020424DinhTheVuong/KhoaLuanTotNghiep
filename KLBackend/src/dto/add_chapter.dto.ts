import { IsString, IsInt, IsArray, ValidateNested, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AddChapterDto {
    @IsNotEmpty()
    @IsNumber()
    bookId: number;

    @IsNotEmpty()
    @IsString()
    bookName: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    chapterNumber: number;

}
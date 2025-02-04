import { IsNotEmpty, IsUUID, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    content_image?: string;
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentBookDto {
    @IsNumber()
    @IsNotEmpty()
    book_id: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}

export class CommentReplyDto {
    @IsNumber()
    @IsNotEmpty()
    comment_id: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}

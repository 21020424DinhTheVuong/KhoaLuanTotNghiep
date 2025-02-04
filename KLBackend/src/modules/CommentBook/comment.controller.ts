import { Controller, Post, Body, Get, Param, Delete, Patch, Req, UploadedFile } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentBookDto, CommentReplyDto } from 'src/dto/comment_book.dto';

@Controller('comment')
export class CommentController {
    constructor(
        private commentBookService: CommentService
    ) { }
    @Post(':userId(\\d+)')
    async addComment(@Param('userId') userId: number, @Body() dto: CommentBookDto) {
        return this.commentBookService.addComment(userId, dto);
    }

    // Add a reply to a comment
    @Post('reply/:userId(\\d+)')
    async addReply(@Param('userId') userId: number, @Body() commentReplyDto: CommentReplyDto) {
        return this.commentBookService.addReply(userId, commentReplyDto);
    }

    // Get all comments for a book
    @Get(':bookId(\\d+)')
    async getCommentsByBook(@Param('bookId') bookId: number) {
        return this.commentBookService.getCommentsByBook(bookId);
    }

    @Patch(':commentId(\\d+)/like')
    async likeComment(@Param('commentId') commentId: number) {
        return this.commentBookService.likeComment(commentId);
    }

    @Patch(':replyId(\\d+)/likeReply')
    async likeReply(@Param('replyId') replyId: number) {
        return this.commentBookService.likeReply(replyId);
    }


}

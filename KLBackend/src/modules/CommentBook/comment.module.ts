import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from 'src/entities/favourite.entity';
import { Account } from 'src/entities/account.entity';
import { Book } from 'src/entities/book.entity';
import { CommentReply } from 'src/entities/comment_reply.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentBook } from 'src/entities/comment_book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CommentReply, Account, Book, CommentBook])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {

}

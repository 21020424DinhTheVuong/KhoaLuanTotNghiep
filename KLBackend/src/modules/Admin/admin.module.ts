import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Book } from 'src/entities/book.entity';
import { BookGenre } from 'src/entities/book_genre.entity';
import { Chapter } from 'src/entities/chapter.entity';
import { Genre } from 'src/entities/genre.entity';
import { Page } from 'src/entities/pages.entity';
import { PostEntity } from 'src/entities/post.entity';
import { ReplyPost } from 'src/entities/reply_post.entity';
import { ReplyPostChildren } from 'src/entities/reply_post_children.entity';
import { Report } from 'src/entities/report.entity';
import { Repository } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Book,
        Account,
        BookGenre,
        Chapter,
        Genre,
        Page,
        PostEntity,
        ReplyPost,
        ReplyPostChildren,
        Report,])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }

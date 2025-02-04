import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ReplyPost } from 'src/entities/reply_post.entity';
import { ReplyPostChildren } from 'src/entities/reply_post_children.entity';
import { Account } from 'src/entities/account.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, ReplyPost, ReplyPostChildren, Account])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService], // Exporting if needed in other modules
})
export class PostModule { }

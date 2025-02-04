import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyPost } from 'src/entities/reply_post.entity';
import { ReplyPostChildren } from 'src/entities/reply_post_children.entity';
import { Account } from 'src/entities/account.entity';
import { PostEntity } from 'src/entities/post.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Report } from 'src/entities/report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, ReplyPost, ReplyPostChildren, Account, Report])],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService],
})
export class ReportModule { }

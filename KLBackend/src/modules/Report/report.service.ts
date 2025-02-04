import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { Account } from 'src/entities/account.entity';
import { ReplyPost } from 'src/entities/reply_post.entity';
import { ReplyPostChildren } from 'src/entities/reply_post_children.entity'
import { CreateReportDto } from 'src/dto/report.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private reportRepository: Repository<Report>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectRepository(ReplyPost)
        private replyPostRepository: Repository<ReplyPost>,
        @InjectRepository(ReplyPostChildren)
        private replyPostChildrenRepository: Repository<ReplyPostChildren>,
    ) { }

    async createReport(createReportDto: CreateReportDto): Promise<Report> {
        const { reporterId, reportedId, postId, replyPostId, replyPostChildrenId, reasonReport } = createReportDto;

        // Check if reporter exists
        const reporter = await this.accountRepository.findOne({
            where: { id: Number(reporterId) },
            select: ['id', 'username', 'display_name', 'avatar']
        });
        if (!reporter) throw new NotFoundException('Reporter not found');

        // Check if reported user exists
        const reported = await this.accountRepository.findOne({
            where: { id: Number(reportedId) },
            select: ['id', 'username', 'display_name', 'avatar']
        });
        if (!reported) throw new NotFoundException('Reported user not found');

        // Check if post exists (if provided)
        let post: PostEntity | null = null;
        if (postId) {
            post = await this.postRepository.findOne({ where: { id: Number(postId) } });
            if (!post) throw new NotFoundException('Post not found');
        }

        // Check if reply post exists (if provided)
        let replyPost: ReplyPost | null = null;
        if (replyPostId) {
            replyPost = await this.replyPostRepository.findOne({ where: { id: Number(replyPostId) } });
            if (!replyPost) throw new NotFoundException('Reply post not found');
        }

        // Check if reply post child exists (if provided)
        let replyPostChildren: ReplyPostChildren | null = null;
        if (replyPostChildrenId) {
            replyPostChildren = await this.replyPostChildrenRepository.findOne({ where: { id: Number(replyPostChildrenId) } });
            if (!replyPostChildren) throw new NotFoundException('Reply post child not found');
        }

        // Create new report instance
        const report = this.reportRepository.create({
            reporter,
            reported,
            post,
            replyPost,
            replyPostChildren,
            reason_report: reasonReport,
        });

        // Save the report to the database
        return this.reportRepository.save(report);
    }
}

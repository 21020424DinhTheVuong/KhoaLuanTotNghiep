import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentBook } from 'src/entities/comment_book.entity';
import { Book } from 'src/entities/book.entity';
import { Account } from 'src/entities/account.entity';
import { CommentBookDto, CommentReplyDto } from 'src/dto/comment_book.dto';
import { CommentReply } from 'src/entities/comment_reply.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentBook) private commentRepository: Repository<CommentBook>,
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(Account) private accountRepository: Repository<Account>,
        @InjectRepository(CommentReply) private replyRepository: Repository<CommentReply>
    ) { }

    async addComment(userId: number, dto: CommentBookDto) {
        const book = await this.bookRepository.findOne({ where: { id: dto.book_id } });
        const user = await this.accountRepository.findOne({ where: { id: userId } });

        if (!book || !user) throw new NotFoundException('Book or User not found');

        const comment = this.commentRepository.create({ book, user, content: dto.content });
        this.commentRepository.save(comment);
        return "Comment successfully!"
    }

    // Add a reply to a comment
    async addReply(userId: number, commentReplyDto: CommentReplyDto) {
        const comment = await this.commentRepository.findOne({ where: { id: commentReplyDto.comment_id } });
        if (!comment) throw new NotFoundException('Comment not found');

        const user = await this.accountRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Create reply using only IDs for relations
        const reply = this.replyRepository.create({
            comment: { id: comment.id }, // Pass only the ID
            user: { id: user.id },       // Pass only the ID
            content: commentReplyDto.content
        });

        return this.replyRepository.save(reply);
    }

    // Get all comments for a book
    async getCommentsByBook(bookId: number) {
        const comments = await this.commentRepository.find({
            where: { book: { id: bookId } },
            relations: ['user', 'replies', 'replies.user'],
            order: { create_at: 'DESC' },
        });
        return comments.map(comment => ({
            ...comment,
            total_reply: comment.replies.length,
        }));
    }

    async likeComment(commentId: number) {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');

        comment.like += 1;
        return this.commentRepository.save(comment);
    }

    async likeReply(replyId: number) {
        const comment = await this.replyRepository.findOne({ where: { id: replyId } });
        if (!comment) throw new NotFoundException('Comment not found');

        comment.like += 1;
        return this.replyRepository.save(comment);
    }

}

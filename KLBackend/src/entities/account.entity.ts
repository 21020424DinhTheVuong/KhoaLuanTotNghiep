import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn } from 'typeorm';
import { CommentBook } from './comment_book.entity';
import { CommentReply } from './comment_reply.entity';
import { PostEntity } from './post.entity';
import { ReplyPost } from './reply_post.entity';
import { ReplyPostChildren } from './reply_post_children.entity';
import { Report } from './report.entity';

@Entity('user') // Maps to the 'account' table in the database
export class Account {
    @PrimaryGeneratedColumn()
    id: number; // Auto-increment primary key

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    username: string; // Unique username

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    display_name: string
    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    password: string; // User's password

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    sex: string;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci', nullable: true, default: null })
    avatar: string;

    @Column({ default: 'user' })
    role: "user"

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: string; // Date of creation (current date)

    // @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    // update_at: string; // Date of creation (current date)
    @UpdateDateColumn({ type: 'timestamp' })  // Auto-update on changes
    update_at: Date;

    @OneToMany(() => CommentBook, (comment) => comment.user, { cascade: true })
    comments: CommentBook[];

    @OneToMany(() => CommentReply, (reply) => reply.user, { cascade: true })
    replies: CommentReply[];

    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[];

    @OneToMany(() => ReplyPost, (reply) => reply.user)
    repliesPost: ReplyPost[];

    @OneToMany(() => ReplyPostChildren, (replyChild) => replyChild.user)
    replyPostChildren: ReplyPostChildren[];

    @OneToMany(() => Report, (report) => report.reporter)
    reportsFiled: Report[];

    // Reports received (user being reported)
    @OneToMany(() => Report, (report) => report.reported)
    reportsReceived: Report[];
}
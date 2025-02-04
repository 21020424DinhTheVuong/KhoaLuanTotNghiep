import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CommentBook } from "./comment_book.entity";
import { Account } from "./account.entity";
@Entity("comment_reply")
export class CommentReply {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // comment_id: number;
    @ManyToOne(() => CommentBook, (comment) => comment.replies, { onDelete: 'CASCADE' })
    comment: CommentBook;

    // @Column()
    // user_id: number;
    @ManyToOne(() => Account, (user) => user.replies, { onDelete: 'CASCADE' })
    user: Account;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    content: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: Date;

    @Column({ type: "int", default: 0 })
    like: number;

    // @Column({ default: 0 })
    // total_reply: number;
}
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Book } from "./book.entity";
import { Account } from "./account.entity";
import { CommentReply } from "./comment_reply.entity";
@Entity("comment_book")
export class CommentBook {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // book_id: number;
    @ManyToOne(() => Book, (book) => book.comments, { onDelete: 'CASCADE' })
    book: Book;

    // @Column()
    // user_id: number;
    @ManyToOne(() => Account, (user) => user.comments, { onDelete: 'CASCADE' })
    user: Account;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    content: string;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    type_comment: "parent";

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: Date;

    @Column({ type: "int", default: 0 })
    like: number;

    // @Column({ default: 0 })
    // total_reply: number;

    @OneToMany(() => CommentReply, (reply) => reply.comment, { cascade: true })
    replies: CommentReply[];

}
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Book } from "./book.entity";
import { Account } from "./account.entity";
import { CommentReply } from "./comment_reply.entity";
@Entity("comment_book")
export class CommentBook {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book, (book) => book.comments, { onDelete: 'CASCADE' })
    book: Book;

    @ManyToOne(() => Account, (user) => user.comments, { onDelete: 'CASCADE' })
    user: Account;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    content: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: Date;

    @Column({ type: "int", default: 0 })
    like: number;

    @OneToMany(() => CommentReply, (reply) => reply.comment, { cascade: true })
    replies: CommentReply[];

}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Account } from "./account.entity";
import { PostEntity } from "./post.entity";
import { ReplyPostChildren } from "./reply_post_children.entity";

@Entity("reply_post")
export class ReplyPost {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PostEntity, (post) => post.replies, { onDelete: "CASCADE" })
    post: PostEntity;  // No need for @Column() post_id

    @ManyToOne(() => Account, (user) => user.repliesPost, { onDelete: "CASCADE" })
    user: Account;  // No need for @Column() user_id

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    content_reply_post: string;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci', nullable: true })
    content_reply_post_image: string;

    @Column({ type: "int", default: 0 })
    like_post: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: Date;
    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    update_at: Date;

    @OneToMany(() => ReplyPostChildren, (replyChild) => replyChild.replyPost, { cascade: true })
    children: ReplyPostChildren[];
}
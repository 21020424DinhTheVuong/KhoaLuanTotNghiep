import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReplyPost } from "./reply_post.entity";
import { Account } from "./account.entity";

@Entity("reply_post_children")
export class ReplyPostChildren {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // reply_post_id: number;
    @ManyToOne(() => ReplyPost, (replyPost) => replyPost.children, { onDelete: 'CASCADE' })
    replyPost: ReplyPost;

    // @Column()
    // user_id: number;
    @ManyToOne(() => Account, (user) => user.replyPostChildren, { onDelete: 'CASCADE' })
    user: Account;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    content_reply_post_children: string;

    // @Column({ type: 'text', collation: 'utf8mb4_unicode_ci', nullable: true })
    // content_reply_post_children_image: string;
    @Column({ type: "int", default: 0 })
    like_post: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    create_at: Date;
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    update_at: Date;
}

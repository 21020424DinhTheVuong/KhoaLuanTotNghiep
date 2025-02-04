import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Account } from "./account.entity";
import { ReplyPost } from "./reply_post.entity";
@Entity("post")
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, (user) => user.posts, { onDelete: "CASCADE" })
    user: Account;  // No need for @Column() user_id

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    content_text: string;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci', nullable: true })
    content_image: string;

    @Column({ type: "int", default: 0 })
    like_post: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: Date;
    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    update_at: Date;

    @OneToMany(() => ReplyPost, (reply) => reply.post, { cascade: true })
    replies: ReplyPost[];
}
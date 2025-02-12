import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { Account } from "./account.entity";
import { PostEntity } from "./post.entity";
import { ReplyPost } from "./reply_post.entity";
import { ReplyPostChildren } from "./reply_post_children.entity";

@Entity("report")
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, (account) => account.reportsFiled, { onDelete: "SET NULL", nullable: true })
    reporter: Account; // The user who reports

    @ManyToOne(() => Account, (account) => account.reportsReceived, { onDelete: "SET NULL", nullable: true })
    reported: Account; // The user being reported

    @ManyToOne(() => PostEntity, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    post: PostEntity; // Reported post (optional)

    @ManyToOne(() => ReplyPost, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    replyPost: ReplyPost; // Reported reply (optional)

    @ManyToOne(() => ReplyPostChildren, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    replyPostChildren: ReplyPostChildren; // Reported child reply (optional)

    @Column({ type: "text", collation: "utf8mb4_unicode_ci" })
    reason_report: string; // Reason for reporting

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: Date; // Auto-generated timestamp
}

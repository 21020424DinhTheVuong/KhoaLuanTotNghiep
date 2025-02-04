import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { Account } from 'src/entities/account.entity';
import * as fs from 'fs'
import { ReplyPost } from 'src/entities/reply_post.entity';
import { ReplyPostChildren } from 'src/entities/reply_post_children.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectRepository(ReplyPost)
        private replyPostRepository: Repository<ReplyPost>,
        @InjectRepository(ReplyPostChildren)
        private replyPostChildrenRepository: Repository<ReplyPostChildren>,

    ) { }

    async getPostInfo(postId: number) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user', 'replies', 'replies.user', 'replies.children'], // Fetch related data
        });

        if (!post) throw new NotFoundException('Post not found');

        return {
            id: post.id,
            content_text: post.content_text,
            content_image: post.content_image,
            like_post: post.like_post,
            create_at: post.create_at,
            update_at: post.update_at,
            user: {
                id: post.user.id,
                display_name: post.user.display_name,
                avatar: post.user.avatar,
            },
            replies: post.replies.map(reply => ({
                id: reply.id,
                content_reply_post: reply.content_reply_post,
                content_reply_post_image: reply.content_reply_post_image,
                like_post: reply.like_post,
                create_at: reply.create_at,
                update_at: reply.update_at,
                user: {
                    id: reply.user.id,
                    display_name: reply.user.display_name,
                    avatar: reply.user.avatar,
                },
                total_reply_post_children: reply.children ? reply.children.length : 0, // Count child replies
            })),
            total_reply_post: post.replies.reduce((sum, reply) => sum + 1 + (reply.children ? reply.children.length : 0), 0),
        };
    }

    async getAllPosts() {
        const posts = await this.postRepository.find({
            relations: ['user', 'replies', 'replies.children'], // Fetch replies and children for counting
            order: { create_at: 'DESC' },
        });

        return posts.map(post => ({
            id: post.id,
            content_text: post.content_text,
            content_image: post.content_image,
            like_post: post.like_post,
            create_at: post.create_at,
            update_at: post.update_at,
            user: {
                id: post.user.id,
                display_name: post.user.display_name,
                avatar: post.user.avatar,
            },
            total_reply_post: post.replies.reduce((sum, reply) => sum + 1 + (reply.children ? reply.children.length : 0), 0),
        }));
    }

    async uploadMediaAndSavePost(userId: string, content: string, files?: Express.Multer.File[] | any): Promise<PostEntity> {
        let mediaPath = ""
        if (files.content_media) {
            mediaPath = files.content_media
                .map((file: any) => file.path.replace(/\\/g, "/")) // Convert backslashes to forward slashes
                .join(",");
        } else {
            mediaPath = null
        }

        const user = await this.accountRepository.findOne({ where: { id: Number(userId) } })
        // Create a new post entity
        const post = this.postRepository.create({
            user,
            content_text: content,
            content_image: mediaPath, // Store paths as comma-separated values
        });

        // Save the post to the database
        return await this.postRepository.save(post);
    }

    async uploadReplyPost(userId: string, postId: number, content: string, files?: Express.Multer.File[] | any): Promise<any> {
        let mediaPath = ""
        if (files.reply_post) {
            mediaPath = files.reply_post
                .map((file: any) => file.path.replace(/\\/g, "/")) // Convert backslashes to forward slashes
                .join(",");
        } else {
            mediaPath = null
        }
        const user = await this.accountRepository.findOne({ where: { id: Number(userId) } })
        const post = await this.postRepository.findOne({ where: { id: Number(postId) } })
        // return mediaPath
        // Create a new post entity
        const replyPost = this.replyPostRepository.create({
            user,
            post,
            content_reply_post: content,
            content_reply_post_image: mediaPath, // Store paths as comma-separated values
        });

        // Save the post to the database
        return await this.replyPostRepository.save(replyPost);
    }

    async uploadReplyPostChildren(userId: number, replyPostId: number, content: string): Promise<any> {

        const user = await this.accountRepository.findOne({ where: { id: userId } })
        const replyPost = await this.replyPostRepository.findOne({ where: { id: replyPostId } })
        // return mediaPath
        // Create a new post entity
        const replyPostChildren = this.replyPostChildrenRepository.create({
            user,
            replyPost,
            content_reply_post_children: content,
        });

        // Save the post to the database
        return await this.replyPostChildrenRepository.save(replyPostChildren);
    }

    async deletePost(id: string): Promise<any> {
        const post = await this.postRepository.findOne({ where: { id: Number(id) } });

        if (!post) throw new Error("Delete failed!");

        await this.postRepository.delete(id);
        return "Delete Successfully";
    }

    async deleteReplyPost(id: string): Promise<any> {
        const post = await this.replyPostRepository.findOne({ where: { id: Number(id) } });

        if (!post) throw new Error("Delete failed!");

        await this.replyPostRepository.delete(id);
        return "Delete Successfully";
    }
    async deleteReplyPostChildren(id: string): Promise<any> {
        const post = await this.replyPostChildrenRepository.findOne({ where: { id: Number(id) } });

        if (!post) throw new Error("Delete failed!");

        await this.replyPostChildrenRepository.delete(id);
        return "Delete Successfully";
    }
    async getAllPostsByUser(userId: number): Promise<any> {
        const posts = await this.postRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'replies', 'replies.children'], // Load user and replies
            order: { create_at: 'DESC' },
        });

        return posts.map((post) => ({
            id: post.id,
            content_text: post.content_text,
            content_image: post.content_image,
            like_post: post.like_post,
            create_at: post.create_at,
            update_at: post.update_at,
            user: {
                id: post.user.id,
                display_name: post.user.display_name,
                avatar: post.user.avatar,
            },
            total_reply_post: post.replies.reduce(
                (sum, reply) => sum + 1 + (reply.children ? reply.children.length : 0),
                0
            ),
        }));
    }

    async getReplyInfo(replyId: number) {
        const reply = await this.replyPostRepository.findOne({
            where: { id: replyId },
            relations: ['user', 'post', 'children', 'children.user'], // Fetch related data
            // order: { children.create_at: 'DESC' }
        });

        if (!reply) throw new NotFoundException('Reply not found');

        return {
            id: reply.id,
            content_reply_post: reply.content_reply_post,
            content_reply_post_image: reply.content_reply_post_image,
            like_post: reply.like_post,
            create_at: reply.create_at,
            update_at: reply.update_at,
            user: {
                id: reply.user.id,
                display_name: reply.user.display_name,
                avatar: reply.user.avatar,
            },
            // post: {
            //     id: reply.post.id,
            //     content_text: reply.post.content_text,
            //     content_image: reply.post.content_image,
            // },
            children: reply.children.map(child => ({
                id: child.id,
                content_reply_post_children: child.content_reply_post_children,
                like_post: child.like_post,
                create_at: child.create_at,
                update_at: child.update_at,
                user: {
                    id: child.user.id,
                    display_name: child.user.display_name,
                    avatar: child.user.avatar,
                }
            })),
            total_reply_post_children: reply.children.length, // Count child replies
        };
    }
    async getReplyChildrenInfo(replyChildrenId: number) {
        const replyChildren = await this.replyPostChildrenRepository.findOne({
            where: { id: replyChildrenId }
        })

        return replyChildren
    }


    async likePost(postId: number): Promise<any> {
        const post = await this.postRepository.findOne({ where: { id: postId } });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        post.like_post += 1;
        return await this.postRepository.save(post);
    }

    async likeReplyPost(replyPostId: number): Promise<any> {
        const replyPost = await this.replyPostRepository.findOne({ where: { id: replyPostId } });

        if (!replyPost) {
            throw new NotFoundException('Post not found');
        }

        replyPost.like_post += 1;
        return await this.replyPostRepository.save(replyPost);
    }

    async likeReplyPostChildren(replyPostChildrenId: number): Promise<any> {
        const replyPostChildren = await this.replyPostChildrenRepository.findOne({ where: { id: replyPostChildrenId } });

        if (!replyPostChildren) {
            throw new NotFoundException('Post not found');
        }

        replyPostChildren.like_post += 1;
        return await this.replyPostChildrenRepository.save(replyPostChildren);
    }

    async updateReplyPost(
        id: number,
        content: string,
        files?: Express.Multer.File[] | any
    ): Promise<any> {
        let mediaPath = ""
        if (files.reply_post) {
            mediaPath = files.reply_post
                .map((file: any) => file.path.replace(/\\/g, "/")) // Convert backslashes to forward slashes
                .join(",");
        } else {
            mediaPath = null
        }
        const replyPost = await this.replyPostRepository.findOne({ where: { id } });

        if (!replyPost) {
            return null; // Reply post not found
        }

        replyPost.content_reply_post = content;
        if (mediaPath) {
            replyPost.content_reply_post_image = mediaPath;
        }
        replyPost.update_at = new Date(); // Update timestamp

        return await this.replyPostRepository.save(replyPost);
    }

    async updatePost(
        id: number,
        content: string,
        files?: Express.Multer.File[] | any
    ): Promise<any> {
        let mediaPath = null
        if (files.content_media) {
            mediaPath = files.content_media
                .map((file: any) => file.path.replace(/\\/g, "/")) // Convert backslashes to forward slashes
                .join(",");
        } else {
            mediaPath = null
        }
        const post = await this.postRepository.findOne({ where: { id } });

        if (!post) {
            return null; // Reply post not found
        }

        post.content_text = content;
        // if (mediaPath) {
        post.content_image = mediaPath;
        // }
        post.update_at = new Date(); // Update timestamp

        return await this.postRepository.save(post);
    }
}

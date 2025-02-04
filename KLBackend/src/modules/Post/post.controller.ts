import { Controller, Get, Post, Param, ParseIntPipe, Body, UseInterceptors, UploadedFiles, Delete, Patch, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get(':postId')
    async getPostInfo(@Param('postId', ParseIntPipe) postId: number) {
        return this.postService.getPostInfo(postId);
    }

    @Get()
    async getAllPosts() {
        return this.postService.getAllPosts();
    }

    @Post('create-post')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'content_media', maxCount: 5 }], {
        storage: diskStorage({
            destination: './uploads/images_post',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
            },
        }),
        limits: { files: 5 },
    }))
    async createPost(
        @Body() body: { userId: string, content: string },
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return await this.postService.uploadMediaAndSavePost(body.userId, body.content, files);
    }

    @Post('add-reply-post/:postId(\\d+)')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'reply_post', maxCount: 5 }], {
        storage: diskStorage({
            destination: './uploads/images_post/reply',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
            },
        }),
        limits: { files: 5 },
    }))
    async addReplyPost(
        @Param("postId") postId: number,
        @Body() body: { userId: string, content: string },
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return await this.postService.uploadReplyPost(body.userId, postId, body.content, files);
        // return { files }
    }

    @Post('add-reply-post-children/:replyPostId')
    async addReplyPostChildren(
        @Param("replyPostId") replyPostId: number,
        @Body() body: { userId: number, content: string },
    ) {
        // console.log(body)
        return await this.postService.uploadReplyPostChildren(body.userId, replyPostId, body.content);
        // return { files }
    }
    @Delete('delete-post/:id(\\d+)')
    async deletePost(@Param('id') id: string) {
        return await this.postService.deletePost(id);
    }
    @Delete('delete-reply-post/:id(\\d+)')
    async deleteReplyPost(@Param('id') id: string) {
        return await this.postService.deleteReplyPost(id);
    }
    @Delete('delete-reply-post-children/:id(\\d+)')
    async deleteReplyPostChildren(@Param('id') id: string) {
        return await this.postService.deleteReplyPostChildren(id);
    }

    @Get('user/:userId(\\d+)')
    async getAllPostsByUser(@Param('userId') userId: number) {
        return await this.postService.getAllPostsByUser(userId);
    }
    @Get('reply-post/:replyPostId')
    async getReplyPostInfor(@Param('replyPostId', ParseIntPipe) replyPostId: number) {
        return this.postService.getReplyInfo(replyPostId);
    }
    @Get('reply-post-children/:replyPostChildrenId')
    async getReplyPostChildrenInfor(@Param('replyPostChildrenId', ParseIntPipe) replyPostChildrenId: number) {
        return this.postService.getReplyChildrenInfo(replyPostChildrenId);
    }

    @Patch('like-post/:postId')
    async likePost(@Param('postId') postId: string) {
        return await this.postService.likePost(Number(postId));
    }

    @Patch('like-reply-post/:replyPostId')
    async likeReplyPost(@Param('replyPostId') replyPostId: number) {
        return await this.postService.likeReplyPost(replyPostId);
    }

    @Patch('like-reply-post-children/:replyPostChilrenId')
    async likeReplyPostChildren(@Param('replyPostChilrenId') replyPostChilrenId: string) {
        return await this.postService.likeReplyPostChildren(Number(replyPostChilrenId));
    }

    @Patch("update-reply-post/:id(\\d+)")
    @UseInterceptors(FileFieldsInterceptor([{ name: 'reply_post', maxCount: 5 }], {
        storage: diskStorage({
            destination: './uploads/images_post/reply',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
            },
        }),
        limits: { files: 5 },
    }))
    async updateReplyPost(
        @Param("id") id: number,
        @Body() body: { content: string },
        @UploadedFiles() files: Express.Multer.File[],

    ) {
        const updatedReply = await this.postService.updateReplyPost(
            id,
            body.content,
            files
        );

        if (!updatedReply) {
            throw new NotFoundException("Reply post not found");
        }

        return "Reply post updated successfully";
    }

    @Patch("update-post/:id(\\d+)")
    @UseInterceptors(FileFieldsInterceptor([{ name: 'content_media', maxCount: 5 }], {
        storage: diskStorage({
            destination: './uploads/images_post',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
            },
        }),
        limits: { files: 5 },
    }))
    async updatePost(
        @Param("id") id: number,
        @Body() body: { content: string },
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const updatedPost = await this.postService.updatePost(
            id,
            body.content,
            files
        );

        if (!updatedPost) {
            throw new NotFoundException("Reply post not found");
        }

        return "Reply post updated successfully";
    }
}

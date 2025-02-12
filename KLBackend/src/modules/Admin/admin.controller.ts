import { Controller, Get, Patch, Query, UseInterceptors, UploadedFile, Param, Body, Post, Delete, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { UpdateBookDto } from 'src/dto/update_book.dto';
import slugify from 'slugify';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AddBookDto } from 'src/dto/add_book.dto';
import * as fs from 'fs';
import { AddChapterDto } from 'src/dto/add_chapter.dto';
import { Type } from 'class-transformer';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    @Get("get-all-books")
    async getAllBooks(
        @Query("search") seachValue = "",
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        return this.adminService.getAllBooks(seachValue, Number(page), Number(limit))
    }

    @Get("get-all-genres")
    async getAllGenres() {
        return this.adminService.getAllGenres()
    }

    @Post("add-genre")
    async addGenre(
        @Body() data: { type: string, describe: string }
    ) {
        return this.adminService.addGenre(data.type, data.describe)
    }

    @Delete('delete-genre/:id(\\d+)')
    async deleteGenre(@Param('id') id: number) {
        return await this.adminService.deleteGenre(id);
    }
    @Patch('change-book/:id(\\d+)')
    @UseInterceptors(
        FileInterceptor('cover_image', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const bookName = req.body.book_name.toLowerCase();
                    const uploadPath = `./images/${bookName}`;
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueName = `cover-${Date.now()}${extname(file.originalname)}`;
                    cb(null, `cover${extname(file.originalname)}`);
                },
            }),
        })
    )
    async updateBook(
        @Param('id') id: number,
        @Body() formData: UpdateBookDto,
        @UploadedFile() coverImage?: Express.Multer.File
    ) {
        return this.adminService.updateBook(id, formData, coverImage);
        // console.log(id, formData, coverImage)
    }

    @Post("add-book")
    @UseInterceptors(
        FileInterceptor('cover_image', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const bookName = req.body.book_name.toLowerCase().replace(/\s+/g, '_'); // Normalize book name
                    console.log(bookName)
                    const uploadPath = `./images/${bookName}`;

                    // Check if folder exists, if not, create it
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }

                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    cb(null, `cover${extname(file.originalname)}`);
                },
            }),
        })
    )
    async addBook(
        @Body() formData: AddBookDto,
        @UploadedFile() files: Express.Multer.File
    ) {
        return this.adminService.createBook(formData, files)
        // console.log(formData, files)
    }

    @Delete('delete-book/:id(\\d+)')
    async deleteBook(@Param('id') id: string) {
        return await this.adminService.deleteBook(Number(id));
    }

    @Get('get-chapter/:id(\\d+)')
    async getChapter(
        @Param("id") id: number,
        @Query("page") page: number,
        @Query("limit") limit: number
    ) {
        return this.adminService.getChapters(id, page, limit)
    }

    @Get('get-page/:chapterId(\\d+)')
    async getPages(
        @Param('chapterId') chapterId: string,
    ) {
        return await this.adminService.getPagesByChapter(
            Number(chapterId),
        );
    }

    @Post('add-chapter')
    @UseInterceptors(
        FilesInterceptor('images', 50, {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const book_name = req.body.bookName || req.query.bookName;
                    const chapter_number = req.body.chapterNumber || req.query.chapterNumber;

                    console.log({ bookName: book_name, chapter: chapter_number })
                    if (!book_name || !chapter_number) {
                        return cb(new BadRequestException('Missing bookName or chapterNumber'), null);
                    }
                    const folderPath = `./images/${book_name}/chap ${chapter_number}`;
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, { recursive: true });
                    }
                    // (req as any).fileIndex = 0; // Initialize file index
                    cb(null, folderPath);
                },
                filename: (req, file, cb) => {
                    if (!(req as any).fileIndex) (req as any).fileIndex = 0; // Ensure req.fileIndex is initialized
                    const filename = `${(req as any).fileIndex + 1}${extname(file.originalname)}`;
                    (req as any).fileIndex++; // Increment for the next file
                    cb(null, filename);
                },
            }),
        })
    )
    async addChapter(
        @Body() formData: AddChapterDto,
        @UploadedFiles() files?: Express.Multer.File[],
    ) {
        return this.adminService.addChapter(formData, files);
    }

    @Delete("delete-chapter/:id(\\d+)")
    async deleteChapter(
        @Param("id") id: number
    ) {
        return this.adminService.deleteChapter(id)
    }

    @Get('get-users')
    async getUsers(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return await this.adminService.getUsers(page, limit);
    }

    @Delete("delete-user/:id(\\d+)")
    async deleteUsers(@Param("id") id: number) {
        return this.adminService.deleteUsers(id)
    }
    @Get("get-user-by-id/:id(\\d+)")
    async getUserById(@Param("id") id: number) {
        return this.adminService.getUserById(id)
    }

    @Get('get-all-posts')
    async getAllPosts(
        @Query('page') page = 1,  // Default to page 1
        @Query('limit') limit = 10 // Default 10 posts per page
    ) {
        return await this.adminService.getAllPosts(Number(page), Number(limit));
    }

    @Get("get-replies-by-post-id/:id(\\d+)")
    async getReplyPostByPostId(
        @Param("id") id: number,
        @Query("page") page = 1,
        @Query("limit") limit = 5
    ) {
        return await this.adminService.getRepliesByPostId(Number(id), Number(page), Number(limit));
    }

    @Get("get-reply-children-by-reply-id/:id(\\d+)")
    async getReplyChildrenByReplyId(
        @Param("id") id: number,
        @Query("page") page = 1,
        @Query("limit") limit = 5
    ) {
        return await this.adminService.getReplyChildrenByReplyId(Number(id), Number(page), Number(limit));
    }

    @Delete("delete-reply-children/:id(\\d+)")
    async deleteReplyChildren(@Param("id") id: number) {
        return this.adminService.deleteReplyChildren(id)
    }
    @Delete("delete-reply-post/:id(\\d+)")
    async deleteReplyPost(@Param("id") id: number) {
        return this.adminService.deleteReplyPost(id)
    }
    @Delete("delete-post/:id(\\d+)")
    async deletePost(@Param("id") id: number) {
        return this.adminService.deletePost(id)
    }

    @Get("get-report")
    async getReports(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        return this.adminService.getReports(Number(page), Number(limit));
    }

    @Delete("delete-report/:id(\\d+)")
    async deleteReport(@Param("id") id: number) {
        return this.adminService.deleteReport(id)
    }
}

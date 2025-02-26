import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { AddBookDto } from 'src/dto/add_book.dto';
import { UpdateBookDto } from 'src/dto/update_book.dto';
import { Account } from 'src/entities/account.entity';
import { Book } from 'src/entities/book.entity';
import { BookGenre } from 'src/entities/book_genre.entity';
import { Chapter } from 'src/entities/chapter.entity';
import { Genre } from 'src/entities/genre.entity';
import { Page } from 'src/entities/pages.entity';
import { PostEntity } from 'src/entities/post.entity';
import { ReplyPost } from 'src/entities/reply_post.entity';
import { ReplyPostChildren } from 'src/entities/reply_post_children.entity';
import { Report } from 'src/entities/report.entity';
import { ILike, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import { AddChapterDto } from 'src/dto/add_chapter.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,

        @InjectRepository(Account)
        private accountRepository: Repository<Account>,

        @InjectRepository(BookGenre)
        private bookGenreRepository: Repository<BookGenre>,

        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,

        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,

        @InjectRepository(Page)
        private pageRepository: Repository<Page>,
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,

        @InjectRepository(ReplyPost)
        private replyPostRepository: Repository<ReplyPost>,

        @InjectRepository(ReplyPostChildren)
        private replyPostChildrenRepository: Repository<ReplyPostChildren>,

        @InjectRepository(Report)
        private reportRepository: Repository<Report>
    ) { }

    async getAllBooks(searchValue: string = "", page: number = 1, limit: number = 5) {
        const whereCondition = searchValue
            ? [
                { book_name: ILike(`%${searchValue}%`) },
                { other_name: ILike(`%${searchValue}%`) }
            ]
            : undefined;
        const [books, total] = await this.bookRepository.findAndCount({
            where: whereCondition,
            take: limit,
            skip: (page - 1) * limit,
            order: { id: 'DESC' },
            relations: { chapters: true, bookGenres: { genre: true }, }, // Ensure 'chapters' is a valid relation in your Book entity
        });

        // Map books to include total chapters count
        const booksWithFilteredData = books.map(book => ({
            id: book.id,
            book_name: book.book_name,
            other_name: book.other_name,
            artist: book.artist,
            cover_image: book.cover_image,
            nation: book.nation,
            status: book.status,
            like_vote: book.like_vote,
            create_at: book.create_at,
            update_at: book.update_at,
            description: book.description,
            totalChapters: book.chapters.length, // Return only count, not chapter details
            genre: book.bookGenres.map(bg => ({
                id: bg.genre.id,
                type: bg.genre.type
            }))
        }));

        return {
            book_list: booksWithFilteredData,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getAllGenres() {
        return await this.genreRepository.find({
            order: { type: 'ASC' }, // Optional: Sort genres by ID
        });
    }

    async addGenre(type: string, describe: string) {
        const existingGenre = await this.genreRepository.findOne({ where: { type } });
        if (existingGenre) {
            throw new ConflictException('Genre already exists');
        }

        const genre = this.genreRepository.create({ type, describe });
        return await this.genreRepository.save(genre);

    }

    async deleteGenre(id: number) {
        const genre = await this.genreRepository.findOne({ where: { id } });

        if (!genre) {
            throw new NotFoundException("Genre not found")
        }

        await this.genreRepository.delete(id)
        return { message: "Xóa thành công!" }
    }
    async updateBook(id: number, formData: UpdateBookDto, coverImage?: Express.Multer.File) {
        const book = await this.bookRepository.findOne({ where: { id } })

        // Update book details
        Object.assign(book, formData);
        // console.log(book)

        // Store the correct image path
        if (coverImage) {
            book.cover_image = `images/${formData.book_name.toLowerCase()}/${coverImage.filename}`;
        }
        book.update_at = new Date();

        await this.bookRepository.save(book);
        return book;
    }

    async createBook(dto: AddBookDto, files: Express.Multer.File): Promise<Book> {
        // Create new book entry
        const book = this.bookRepository.create({
            book_name: dto.book_name,
            other_name: dto.other_name,
            artist: dto.artist,
            status: "Đang tiến hành",
            nation: dto.nation,
            description: dto.description,
            cover_image: `images/${dto.book_name}/${files.filename}`
        });
        const savedBook = await this.bookRepository.save(book);

        // Create BookGenre relationships
        for (const genreId of dto.genre) {
            const genre = await this.genreRepository.findOne({ where: { id: Number(genreId) } });
            if (genre) {
                const bookGenre = this.bookGenreRepository.create({
                    book_id: savedBook.id,
                    genre_id: genre.id,
                });
                await this.bookGenreRepository.save(bookGenre);
            }
        }

        return savedBook;
    }

    async deleteBook(bookId: number): Promise<{ message: string }> {
        // Find the book
        const book = await this.bookRepository.findOne({ where: { id: bookId } });
        if (!book) throw new NotFoundException('Book not found');

        // Delete the book entry
        try {
            await this.bookRepository.remove(book);

            // Delete the book's folder in the images directory
            const bookFolderPath = path.join(__dirname, '../../images', book.book_name.toLowerCase().replace(/\s+/g, '_'));
            if (fs.existsSync(bookFolderPath)) {
                fs.rmSync(bookFolderPath, { recursive: true, force: true });
            }

            return { message: 'Book deleted successfully' };
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete book');
        }
    }

    async getChapters(bookId: number, page: number = 1, limit: number = 5): Promise<any> {
        if (page < 1) page = 1;
        if (limit < 1) limit = 5;

        const offset = (page - 1) * limit;

        // Get paginated chapters and total count
        const [chapters, total] = await this.chapterRepository.findAndCount({
            where: { book_id: bookId },
            take: limit,
            skip: offset,
            order: { id: 'ASC' }, // Change order if needed
        });

        if (!chapters.length) throw new NotFoundException('No chapters found for this book');

        return {
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalChapters: total,
            limit: Number(limit),
            chapters,
        };
    }

    async getPagesByChapter(chapterId: number) {
        // Get paginated pages and total count
        const [pages, total] = await this.pageRepository.findAndCount({
            where: { chapter_id: chapterId },
            order: { id: 'ASC' }, // Change order if needed
        });

        if (!pages.length) throw new NotFoundException('No pages found for this chapter');

        return {
            total,
            pages,
        };
    }
    async addChapter(
        formData: AddChapterDto,
        files?: Express.Multer.File[]
    ) {
        const book = await this.bookRepository.findOne({ where: { id: formData.bookId } });
        if (!book) {
            throw new BadRequestException('Book not found');
        }

        // Create new chapter
        const newChapter = this.chapterRepository.create({
            book_id: formData.bookId,
            title: formData.title,
            chapter_number: formData.chapterNumber,
            book,
        });

        const savedChapter = await this.chapterRepository.save(newChapter);

        // Save page details with sequential filenames
        const newPages = files.map((file, index) => {
            return this.pageRepository.create({
                chapter_id: savedChapter.id,
                chapter_number: formData.chapterNumber,
                page_number: index + 1,
                image: join(`images/${formData.bookName}/chap ${formData.chapterNumber}/`, file.filename),
                chapter: savedChapter,
            });
        });

        await this.pageRepository.save(newPages);
        return { message: "Thêm thành công!" };
    }
    async deleteChapter(id: number) {
        const chapter = await this.chapterRepository.findOne({
            where: { id }
        })

        if (!chapter) {
            throw new NotFoundException("Chapter not found!")
        }

        await this.chapterRepository.delete(id)
        return { message: "Xóa thành công!" }
    }

    async getUsers(page: number, limit: number) {
        const [users, total] = await this.accountRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'ASC' }, // Optional: Sort by newest users
        });

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async deleteUsers(id: number) {
        const user = await this.accountRepository.findOne({
            where: { id }
        })

        if (!user) {
            throw new NotFoundException("Không tìm thấy người dùng!")
        }

        await this.accountRepository.delete(id)
        return { message: "Xóa thành công!" }
    }

    async getUserById(id: number) {
        return this.accountRepository.findOne({
            where: { id }
        })
    }

    async getAllPosts(page: number, limit: number) {
        const offset = (page - 1) * limit; // Convert 1-based page to 0-based offset

        const [posts, total] = await this.postRepository.findAndCount({
            skip: offset,
            take: limit,
            order: { create_at: 'DESC' }, // Sort by latest posts
            relations: ['user'],
            select: {
                id: true,
                content_text: true,
                content_image: true,
                like_post: true,
                create_at: true,
                update_at: true,
                user: {
                    id: true,
                    username: true,
                    avatar: true, // Add any additional fields from Account
                },
            },
        });

        return {
            posts,
            totalPosts: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getRepliesByPostId(postId: number, page: number, limit: number) {
        const offset = (page - 1) * limit; // Convert 1-based page to 0-based offset

        const [replies, total] = await this.replyPostRepository.findAndCount({
            where: { post: { id: postId } },
            skip: offset,
            take: limit,
            order: { create_at: 'ASC' }, // Sort by oldest replies first
            relations: ['user'], // Include user details who made the reply
            select: {
                id: true,
                content_reply_post: true,
                content_reply_post_image: true,
                like_post: true,
                create_at: true,
                user: {
                    id: true,
                    username: true, // Add any additional fields from Account
                },
            },
        });

        return {
            replies,
            totalReplies: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getReplyChildrenByReplyId(replyId: number, page: number, limit: number) {
        const offset = (page - 1) * limit; // Convert 1-based page to 0-based offset

        const [replyChildren, total] = await this.replyPostChildrenRepository.findAndCount({
            where: { replyPost: { id: replyId } },
            skip: offset,
            take: limit,
            order: { create_at: 'ASC' }, // Sort by oldest replies first
            relations: ['user'], // Include user details who made the reply
            select: {
                id: true,
                content_reply_post_children: true,
                like_post: true,
                create_at: true,
                user: {
                    id: true,
                    username: true, // Add any additional fields from Account
                },
            },
        });

        return {
            replyChildren,
            totalReplyChildren: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async deleteReplyChildren(id: number) {
        const replyChilden = await this.replyPostChildrenRepository.findOne({
            where: { id }
        })

        if (!replyChilden) {
            throw new NotFoundException("Reply Children not found!")
        }

        await this.replyPostChildrenRepository.delete(id)
        return { message: "Xóa thành công!" }
    }
    async deleteReplyPost(id: number) {
        const replyPost = await this.replyPostRepository.findOne({
            where: { id }
        })

        if (!replyPost) {
            throw new NotFoundException("Reply Post not found!")
        }

        await this.replyPostRepository.delete(id)
        return { message: "Xóa thành công!" }
    }
    async deletePost(id: number) {
        const post = await this.postRepository.findOne({
            where: { id }
        })

        if (!post) {
            throw new NotFoundException("Post not found!")
        }

        await this.postRepository.delete(id)
        return { message: "Xóa thành công!" }
    }
    async getReports(page: number, limit: number) {
        const [reports, total] = await this.reportRepository.findAndCount({
            relations: ['reporter', 'reported', 'post', 'replyPost', 'replyPostChildren'],
            order: { create_at: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            reports,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async deleteReport(id: number) {
        const report = await this.reportRepository.findOne({
            where: { id }
        })

        if (!report) {
            throw new NotFoundException("Report not found!")
        }

        await this.reportRepository.delete(id)
        return { message: "Xóa thành công!" }
    }
}

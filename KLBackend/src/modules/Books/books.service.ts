// Import necessary modules and dependencies
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Book } from 'src/entities/book.entity';
import { Chapter } from 'src/entities/chapter.entity';
import { BookGenre } from 'src/entities/book_genre.entity';
import { Genre } from 'src/entities/genre.entity';
import { Page } from 'src/entities/pages.entity';
@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,

        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,

        @InjectRepository(BookGenre)
        private readonly bookGenreRepository: Repository<BookGenre>,

        @InjectRepository(Page)
        private readonly pageRepository: Repository<Page>,
    ) { }

    // Function to return all books
    async getAllBooks(): Promise<Book[]> {
        return await this.bookRepository.find();
    }

    // Function to return a book by ID
    async getBookById(id: number): Promise<Book> {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }
    async getTopBooks(): Promise<any[]> {
        // Fetch books sorted by like_vote in descending order, limiting to 6 books
        const books = await this.bookRepository.find({
            take: 6, // Limit to 6 books
            order: {
                like_vote: 'DESC', // Order by like_vote in descending order
            },
            select: ['id', 'book_name', 'create_at', 'cover_image'],
        });

        // For each book, find the last chapter
        const result = await Promise.all(
            books.map(async (book) => {
                // Find the last chapter for the current book
                const lastChapter = await this.chapterRepository.findOne({
                    where: { book_id: book.id }, // Reference book_id instead of book object
                    order: { chapter_number: 'DESC' }, // Order by chapter_number in descending order
                });

                // Return the book with the last chapter number (if any, or 0 if not found)
                return {
                    ...book, // Spread book details
                    lastChapter: lastChapter ? lastChapter.chapter_number : 0, // Handle case where no chapter is found
                };
            }),
        );

        return result;
    }

    async getEarliestUpdatedBooks(): Promise<Book[]> {
        const books = await this.bookRepository.find({
            take: 8, // Limit to 6 books
            order: {
                update_at: 'ASC', // Order by like_vote in descending order
            },
            select: ['id', 'book_name', 'create_at', 'cover_image']
        });

        // For each book, find the last chapter
        const result = await Promise.all(
            books.map(async (book) => {
                const lastChapter = await this.chapterRepository.findOne({
                    where: { id: book.id },
                    order: { chapter_number: 'DESC' }, // Order by chapter_number in descending order
                    // select: ['chapter_number']
                });

                return {
                    ...book, // Spread book details
                    lastChapter: lastChapter.chapter_number === null ? 0 : lastChapter.chapter_number, // Add the last chapter
                };
            }),
        );

        return result;
    }

    async getGenresByBookId(bookId: number): Promise<Genre[]> {
        const bookGenres = await this.bookGenreRepository.find({
            where: { book_id: bookId },
            relations: ['genre'],
        });

        return bookGenres.map((bookGenre) => bookGenre.genre);
    }

    async getAllChaptersWithPages(bookId: number, page: number, take: number): Promise<any> {
        const skip = (page - 1) * take;
        const bookName = await this.bookRepository.findOne({
            where: { id: bookId },
            // select: ["book_name"]
        })
        // Fetch chapters with chapter_number and create_at, without pages
        const chapters = await this.chapterRepository.find({
            where: { book_id: bookId },
            select: ["id", 'chapter_number', "title", 'create_at'], // Only select chapter_number and create_at
            order: { chapter_number: 'DESC' },
            take,
            skip,
        });

        // Fetch the pages for the chapters, explicitly selecting the columns you need
        const chaptersWithPages = await Promise.all(
            chapters.map(async (chapter) => {
                return {
                    chapter_id: chapter.id,
                    title: chapter.title,
                    chapter_number: chapter.chapter_number,
                    create_at: chapter.create_at,
                    // pages, // Add pages data
                };
            })
        );

        const totalChapters = await this.chapterRepository.count({
            where: { book_id: bookId },
        });

        const totalPages = Math.ceil(totalChapters / take);

        return {
            book_name: bookName.book_name,
            data: chaptersWithPages,
            total: totalChapters,
            page,
            totalPages,
        };
    }

    async getAllPages(chapterId: number): Promise<any[]> {
        // Fetch all pages associated with the given chapter_id
        const pages = await this.pageRepository.find({
            where: { chapter_id: chapterId },
            order: { page_number: 'ASC' }, // Order pages by page_number in ascending order
            select: ['id', 'page_number', 'image']
        });

        return pages;
    }

    async getAllPagesWithNameAndChapter(bookName: string, chapterNumber: number): Promise<any> {
        // Find the chapter using book_name and chapter_number
        const chapter = await this.chapterRepository
            .createQueryBuilder('chapter')
            .innerJoinAndSelect('chapter.book', 'book')
            .where('book.book_name = :bookName', { bookName })
            .andWhere('chapter.chapter_number = :chapterNumber', { chapterNumber })
            .select(['chapter.id', 'chapter.title', 'chapter.chapter_number', 'book.book_name']) // Select required fields
            .getOne();

        if (!chapter) {
            throw new NotFoundException('Chapter not found');
        }

        // Fetch all pages for this chapter
        const pages = await this.pageRepository.find({
            where: { chapter_id: chapter.id },
            order: { page_number: 'ASC' },
        });

        return {
            book_name: bookName,
            chapter_title: chapter.title, // Include the chapter title
            chapter_id: chapter.id,
            chapter_number: chapterNumber,
            pages: pages.map(page => ({
                id: page.id,
                page_number: page.page_number,
                image: page.image,
            })),
        };
    }

    async searchBooks(bookName: string): Promise<any> {
        const books = await this.bookRepository
            .createQueryBuilder('book')
            .where('book.book_name LIKE :bookName', { bookName: `%${bookName}%` })
            .orWhere('book.other_name LIKE :bookName', { bookName: `%${bookName}%` }) // Thêm điều kiện tìm trong `other_name`
            .select(['book.id', 'book.book_name', 'book.other_name', 'book.cover_image', 'book.create_at'])
            .getMany();

        // Lấy chương mới nhất cho từng sách
        const result = await Promise.all(
            books.map(async (book) => {
                const lastChapter = await this.chapterRepository.findOne({
                    where: { book: { id: book.id } },
                    order: { chapter_number: 'DESC' },
                });

                return {
                    id: book.id,
                    book_name: book.book_name,
                    cover_image: book.cover_image,
                    create_at: book.create_at,
                    lastChapter: lastChapter ? lastChapter.chapter_number : 0,
                    //  timeAgo: this.getTimeAgo(book.create_at),
                };
            }),
        );

        return result;
    }

    async getBooksWithFilters(
        genre?: string,
        status?: string,
        nation?: string,
        filter?: 'postTime' | 'updateTime',
        order: 'ASC' | 'DESC' = 'DESC'
    ): Promise<any> {
        const query = this.bookRepository.createQueryBuilder('book')
            .leftJoin('book.bookGenres', 'bookGenre')
            .leftJoin('bookGenre.genre', 'genre')
            .leftJoin(
                (qb) => qb
                    .select('chapter.book_id', 'book_id')
                    .addSelect('MAX(chapter.chapter_number)', 'lastChapter')
                    .from(Chapter, 'chapter')
                    .groupBy('chapter.book_id'),
                'lastChapter',
                'lastChapter.book_id = book.id'
            )
            .select([
                'book.id',
                'book.book_name',
                'book.cover_image',
                'book.create_at',
                'COALESCE(lastChapter.lastChapter, 0) AS lastChapter'
            ])
            .distinctOn(['book.id']);

        if (genre) {
            query.andWhere('genre.type LIKE :genre', { genre: `%${genre}%` });
        }
        if (status) {
            query.andWhere('book.status = :status', { status });
        }
        if (nation) {
            query.andWhere('book.nation = :nation', { nation });
        }

        // Sắp xếp theo filter (postTime hoặc updateTime)
        if (filter === 'postTime') {
            query.orderBy('book.create_at', order || 'DESC');
        } else if (filter === 'updateTime') {
            query.orderBy('book.update_at', order || 'DESC');
        }

        const books = await query.getRawMany();

        // if (filter === 'postTime') {
        //     query.orderBy('book.create_at', order);
        // } else if (filter === 'updateTime') {
        //     query.orderBy('last_update', order);
        // }


        // return books
        return books.map((book) => ({
            id: book.book_id,
            book_name: book.book_book_name,
            cover_image: book.book_cover_image,
            create_at: book.book_create_at,
            lastChapter: book.book_lastChapter || 0, // Nếu không có chapter nào, trả về 0
        }));
    }

    async getBooksByRanking(status?: string, nation?: string): Promise<any[]> {
        const query = this.bookRepository.createQueryBuilder('book')
            .leftJoin(
                subQuery => {
                    return subQuery
                        .select([
                            'chapter.book_id AS book_id',
                            'MAX(chapter.chapter_number) AS lastChapterNumber'
                        ])
                        .from('chapter', 'chapter')
                        .groupBy('chapter.book_id');
                },
                'latestChapter',
                'latestChapter.book_id = book.id'
            )
            .select([
                'book.id AS id',
                'book.book_name AS book_name',
                'book.cover_image AS cover_image',
                'book.create_at AS create_at',
                'latestChapter.lastChapterNumber AS lastChapter'
            ])
            .groupBy('book.id, latestChapter.lastChapterNumber');

        if (status) {
            query.andWhere('book.status = :status', { status });
        }
        if (nation) {
            query.andWhere('book.nation = :nation', { nation });
        }

        const books = await query.getRawMany();
        return books.map(book => ({
            id: book.id,
            book_name: book.book_name,
            cover_image: book.cover_image,
            create_at: book.create_at,
            lastChapter: book.lastChapter || null // Nếu chưa có chương nào, trả về null
        }));
    }


}
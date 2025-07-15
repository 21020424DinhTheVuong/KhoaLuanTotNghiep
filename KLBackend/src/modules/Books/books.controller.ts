import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { ImageService } from './image.sevice';
import { Book } from 'src/entities/book.entity';
import { Genre } from 'src/entities/genre.entity';
@Controller('books')
export class BooksController {
    constructor(
        private readonly imageService: ImageService,
        private readonly bookService: BooksService) { }

    // @Get('genres')
    // getGenres() {
    //     return this.imageService.getGenres();
    // }

    // @Get(':genre/cover')
    // getCover(@Param('genre') genre: string) {
    //     return { cover: this.imageService.getCover(genre) };
    // }

    // @Get(':genre/chapters')
    // getChapters(@Param('genre') genre: string) {
    //     return this.imageService.getChapters(genre);
    // }

    // @Get(':genre/:chapter')
    // getChapterImages(
    //     @Param('genre') genre: string,
    //     @Param('chapter') chapter: string,
    // ) {
    //     return this.imageService.getChapterImages(genre, chapter);
    // }

    @Get()
    getAllBooks() {
        return this.bookService.getAllBooks();
    }

    @Get(':id(\\d+)')
    getBookById(@Param('id') id: number) {
        return this.bookService.getBookById(id);
    }
    @Get('top')
    async getTopBooks(): Promise<Book[]> {
        return this.bookService.getTopBooks();
    }
    @Get('reading-times')
    async getTopReadingBooks(): Promise<Book[]> {
        return this.bookService.getTopReadingBooks();
    }
    @Get("new")
    async getNewUpdateBooks(): Promise<Book[]> {
        return this.bookService.getEarliestUpdatedBooks()
    }

    @Get(':id(\\d+)/genres')
    async getGenresByBookId(@Param('id') bookId: number): Promise<Genre[]> {
        return this.bookService.getGenresByBookId(bookId);
    }

    @Get(':id(\\d+)/chapters')
    async getAllChapters(
        @Param('id') id: number,
        @Query('page') page: number = 1,
    ) {
        return this.bookService.getAllChaptersWithPages(id, page, 10);
    }

    @Get('chapter/:id(\\d+)')
    async getAllPages(@Param('id') chapterId: number) {
        return this.bookService.getAllPages(chapterId)
    }

    @Get('pages')
    async getAllPagesWithNameAndChapter(
        @Query('book_name') bookName: string,
        @Query('chapter_number') chapterNumber: number,
    ) {
        return await this.bookService.getAllPagesWithNameAndChapter(bookName, Number(chapterNumber));
    }

    @Get('search')
    async searchBooks(@Query('bookName') bookName: string) {
        return this.bookService.searchBooks(bookName);
    }

    @Get('filter')
    async getBooks(
        @Query('genre') genre?: string,
        @Query('status') status?: string,
        @Query('nation') nation?: string,
        @Query('filter') filter?: 'postTime' | 'updateTime',
        @Query('order') order?: 'ASC' | 'DESC'
    ): Promise<any> {
        return this.bookService.getBooksWithFilters(genre, status, nation, filter, order);
    }


    @Get('filter-rank')
    async getBooksByStatusAndNation(
        @Query('status') status?: string,
        @Query('nation') nation?: string
    ) {
        return this.bookService.getBooksByRanking(status, nation);
    }

    @Post("rating")
    async ratingBook(
        @Body("bookId") bookId:number,
        @Body("valueRate") valueRate:number,
    ){
        return this.bookService.ratingBook(bookId, valueRate);
    }
}

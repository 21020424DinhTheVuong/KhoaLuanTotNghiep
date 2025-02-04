import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ImageService } from './image.sevice';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Chapter } from 'src/entities/chapter.entity';
import { BookGenre } from 'src/entities/book_genre.entity';
import { Genre } from 'src/entities/genre.entity';
import { Page } from 'src/entities/pages.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Book, Chapter, BookGenre, Genre, Page])],
    controllers: [BooksController],
    providers: [BooksService, ImageService],
})
export class BooksModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Book } from 'src/entities/book.entity';
import { Chapter } from 'src/entities/chapter.entity';
import { BookGenre } from 'src/entities/book_genre.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Genre, Book, Chapter, BookGenre])],
    controllers: [GenresController],
    providers: [GenresService],
})
export class GenresModule { }

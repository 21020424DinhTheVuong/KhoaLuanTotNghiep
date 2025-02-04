import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Genre } from 'src/entities/genre.entity';
import { Repository } from 'typeorm';
import { Chapter } from 'src/entities/chapter.entity';
import { BookGenre } from 'src/entities/book_genre.entity';

@Injectable()
export class GenresService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,

        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) { }

    async getGenreByTitle(title: string): Promise<Genre> {
        const genre = await this.genreRepository.findOne({ where: { type: title } });

        if (!genre) {
            throw new NotFoundException('Genre not found');
        }

        return genre;
    }

    async getBooksWithFilters(
        genre?: string,
        status?: string,
        nation?: string,
        filter?: 'postTime' | 'updateTime',
        order: 'ASC' | 'DESC' = 'DESC'
    ): Promise<Book[]> {
        const query = this.bookRepository
            .createQueryBuilder('book')
            .leftJoin('book.bookGenres', 'bookGenre')
            .leftJoin('bookGenre.genre', 'genre') // Join với Genre thông qua BookGenre
            .leftJoin(
                Chapter,
                'lastChapter',
                'book.id = lastChapter.book_id'
            )
            .addSelect('MAX(lastChapter.update_at)', 'last_update')
            .groupBy('book.id')
            .where('1=1');

        if (genre) query.andWhere('genre.title LIKE :genre', { genre: `%${genre}%` });
        if (status) query.andWhere('book.status = :status', { status });
        if (nation) query.andWhere('book.nation = :nation', { nation });

        if (filter === 'postTime') {
            query.orderBy('book.create_at', order);
        } else if (filter === 'updateTime') {
            query.orderBy('last_update', order);
        }

        return await query.getMany();
    }



}

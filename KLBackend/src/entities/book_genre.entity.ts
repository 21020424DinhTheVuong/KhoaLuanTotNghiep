import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from './book.entity';
import { Genre } from './genre.entity';

@Entity('book_genre')
export class BookGenre {
    @PrimaryColumn()
    book_id: number;

    @PrimaryColumn()
    genre_id: number;

    @ManyToOne(() => Book, (book) => book.bookGenres, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @ManyToOne(() => Genre, (genre) => genre.bookGenres, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'genre_id' })
    genre: Genre;
}

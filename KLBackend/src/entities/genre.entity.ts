import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Book } from './book.entity';
import { BookGenre } from './book_genre.entity';

@Entity("genre")
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    type: string;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    describe: string;

    @OneToMany(() => BookGenre, (bookGenre) => bookGenre.genre)
    bookGenres: BookGenre[];
}

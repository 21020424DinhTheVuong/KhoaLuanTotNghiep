import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Chapter } from './chapter.entity';
import { Genre } from './genre.entity';
import { BookGenre } from './book_genre.entity';
import { Favourite } from './favourite.entity';
import { CommentBook } from './comment_book.entity';

@Entity('book') // Maps to the 'account' table in the database
export class Book {
    @PrimaryGeneratedColumn()
    id: number; // Auto-increment primary key

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    book_name: string; // Book name field

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci', nullable: true })
    other_name: string
    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    artist: string; // User's password

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    cover_image: string;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    nation: string;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    status: string;

    // @OneToMany(() => Chapter, (chapter) => chapter.book)
    // chapters: Chapter[];
    @Column({ type: 'int', default: 0 })
    reading_times: number;

    @Column('decimal', { precision: 2, scale: 1 }) 
    rating: number;

    @Column({ type: 'int', default: 0 })
    vote: number;

    @Column({ type: 'int', default: 0 })
    like_vote: number

    @OneToMany(() => Chapter, chapter => chapter.book)
    chapters: Chapter[];
    @OneToMany(() => BookGenre, (bookGenre) => bookGenre.book)
    bookGenres: BookGenre[];
    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: Date; // Date of creation (current date)

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    update_at: Date; // Date of creation (current date)

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    description: string;

    @OneToMany(() => Favourite, (favourite) => favourite.book)  // Define reverse relationship
    favourites: Favourite[];

    @OneToMany(() => CommentBook, (comment) => comment.book, { cascade: true })
    comments: CommentBook[];
}
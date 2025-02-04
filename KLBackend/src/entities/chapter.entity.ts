import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from './book.entity';
import { Page } from './pages.entity';

@Entity('chapter') // Maps to the 'account' table in the database
export class Chapter {
    @PrimaryGeneratedColumn()
    id: number; // Auto-increment primary key

    @Column()
    book_id: number; // Book name field

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    title: string
    @Column()
    chapter_number: number;

    @OneToMany(() => Page, (page) => page.chapter)
    pages: Page[];
    @ManyToOne(() => Book, book => book.chapters)
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: string; // Date of creation (current date)

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    update_at: string; // Date of creation (current date)

}
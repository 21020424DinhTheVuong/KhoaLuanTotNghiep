import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Chapter } from './chapter.entity'; // Import the Chapter entity

@Entity('pages')
export class Page {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chapter_id: number;

    @Column()
    page_number: number;

    @Column({ type: 'text', collation: 'utf8mb4_unicode_ci' })
    image: string;

    @Column()
    chapter_number: number;
    // Relation to Chapter
    @ManyToOne(() => Chapter, (chapter) => chapter.pages, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'chapter_id' })
    chapter: Chapter;
}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity("favourite")

export class Favourite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    book_id: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIME' })
    create_at: string;

    @ManyToOne(() => Book, (book) => book.favourites)  // Make sure to set up the relationship
    @JoinColumn({ name: 'book_id' })
    book: Book;
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountDto } from 'src/dto/update_account.dto';
import { Account } from 'src/entities/account.entity';
import { Book } from 'src/entities/book.entity';
import { Favourite } from 'src/entities/favourite.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,

        @InjectRepository(Favourite)
        private favouriteRepository: Repository<Favourite>,

        @InjectRepository(Book)
        private bookRepository: Repository<Book>
    ) { }

    async getUserById(id: number) {
        const user = await this.accountRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateUser(userId: number, updateAccount: UpdateAccountDto, file?: Express.Multer.File) {
        const user = await this.accountRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        user.display_name = updateAccount.display_name;
        user.sex = updateAccount.sex;
        if (file) {
            user.avatar = `uploads/avatar/${file.filename}`;
        }

        return this.accountRepository.save(user);
    }


    async addToFavourite(userId: number, bookId: number): Promise<Favourite> {
        // Kiểm tra xem sách đã có trong danh sách yêu thích chưa
        const existingFavourite = await this.favouriteRepository.findOne({
            where: { user_id: userId, book_id: bookId }
        });

        if (existingFavourite) {
            throw new Error('This book is already in your favourite list.');
        }

        // Thêm sách vào danh sách yêu thích
        const favourite = this.favouriteRepository.create({ user_id: userId, book_id: bookId });
        return await this.favouriteRepository.save(favourite);
    }

    async isBookInFavourite(userId: number, bookId: number): Promise<boolean> {
        const favourite = await this.favouriteRepository.findOne({
            where: { user_id: userId, book_id: bookId },
        });
        return favourite !== null;
    }

    async getFavouriteBooks(userId: number): Promise<any> {
        const books = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.favourites', 'favourite')  // Join with the Favourite entity
            .select(['book.id', 'book.book_name', 'book.artist', 'book.cover_image'])  // Select the fields you want
            .where('favourite.user_id = :userId', { userId })  // Filter by user
            .getMany();

        return books.map(book => ({
            id: book.id,
            book_name: book.book_name,
            artist: book.artist,
            cover_image: book.cover_image,
        }));
    }

    async removeFromFavourite(userId: number, bookId: number): Promise<string> {
        // Find the favourite entry based on user_id and book_id
        const favourite = await this.favouriteRepository.findOne({
            where: { user_id: userId, book_id: bookId },
        });

        // If the favourite entry doesn't exist, throw an error
        if (!favourite) {
            throw new Error('This book is not in your favourite list.');
        }

        // Remove the book from the favourite list
        await this.favouriteRepository.remove(favourite);

        return 'Book removed from favourites successfully';
    }

    async searchUser(searchValue: string): Promise<any> {
        if (!searchValue) {
            throw new NotFoundException('Search value cannot be empty');
        }

        return await this.accountRepository.find({
            where: [
                { username: ILike(`%${searchValue}%`) },  // Search by username
                { display_name: ILike(`%${searchValue}%`) } // Search by display_name
            ],
            select: ["id", "username", "display_name", "avatar"]
        });
    }
}

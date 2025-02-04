import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from 'src/entities/favourite.entity';
import { AccountsService } from './accounts.service';
import { Account } from 'src/entities/account.entity';
import { AccountsController } from './accounts.controller';
import { Book } from 'src/entities/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Favourite, Account, Book])],
    controllers: [AccountsController],
    providers: [AccountsService],
})
export class AccountsModule {

}

import { Controller, Post, Body, Get, Param, Delete, Patch, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccountsService } from './accounts.service';
import { diskStorage } from "multer";
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path'
import { UpdateAccountDto } from 'src/dto/update_account.dto';

@Controller('accounts')
export class AccountsController {
    constructor(
        private accountsService: AccountsService
    ) { }

    @Get(':id(\\d+)')
    async getUserById(@Param('id') id: number) {
        return this.accountsService.getUserById(id);
    }

    @Patch('change-information/:id(\\d+)')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './uploads/avatar',
                filename: (req, file, cb) => {
                    const userId = req.params.id;
                    // const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'avatar');
                    // Save the new file with userId + timestamp
                    const uniqueName = `${userId}-${Date.now()}${extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
        })
    )
    async updateUser(
        @Param('id') userId: number,
        @Body() updateAccount: UpdateAccountDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.accountsService.updateUser(userId, updateAccount, file);
    }


    @Post('add')
    async addToFavourite(@Body() body: { userId: number, bookId: number }) {
        return this.accountsService.addToFavourite(body.userId, body.bookId);
    }

    @Get(':bookId(\\d+)/favourite/:userId(\\d+)')
    async checkBookFavourite(
        @Param('userId') userId: number,
        @Param('bookId') bookId: number,
    ): Promise<boolean> {
        return this.accountsService.isBookInFavourite(userId, bookId);
    }

    @Get(':userId(\\d+)/favourites')
    async getUserFavouriteBooks(@Param('userId') userId: number): Promise<any> {
        return this.accountsService.getFavouriteBooks(userId);
    }

    @Delete('remove/:userId(\\d+)/:bookId(\\d+)')
    async removeFromFavourite(
        @Param('bookId') bookId: number,
        @Param('userId') userId: number,
    ): Promise<string> {
        return this.accountsService.removeFromFavourite(userId, bookId);
    }

    @Get('search')
    async searchUser(@Query('searchValue') searchValue: string) {
        return await this.accountsService.searchUser(searchValue);
    }
}

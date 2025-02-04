import { Controller, Get, Param, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from 'src/entities/genre.entity';

@Controller('genres')
export class GenresController {
    constructor(
        private readonly genreService: GenresService,
    ) { }

    @Get('')
    async getGenre(@Query('title') title: string): Promise<Genre> {
        return this.genreService.getGenreByTitle(title);
    }

    @Get('filter')
    async getBooks(
        @Query('genre') genre?: string,
        @Query('status') status?: string,
        @Query('nation') nation?: string,
        @Query('filter') filter?: 'postTime' | 'updateTime',
        @Query('order') order?: 'ASC' | 'DESC'
    ): Promise<any> {
        return this.genreService.getBooksWithFilters(genre, status, nation, filter, order);
    }

}

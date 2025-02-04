import { Injectable } from '@nestjs/common';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImageService {
    private readonly imagesBasePath = join(__dirname, '..', '..', 'images'); // Adjusted path

    // Get all genres
    getGenres(): string[] {
        return this.getDirectories(this.imagesBasePath);
    }

    // Get all chapters in a genre
    getChapters(genre: string): string[] {
        const genrePath = join(this.imagesBasePath, genre);
        return this.getDirectories(genrePath);
    }

    // Get all images in a chapter
    getChapterImages(genre: string, chapter: string): string[] {
        const chapterPath = join(this.imagesBasePath, genre, chapter);
        return this.getFiles(chapterPath).map(file => `/images/${genre}/${chapter}/${file}`);
    }

    // Get the cover image of a genre
    getCover(genre: string): string {
        return `/images/${genre}/cover.jpg`; // Relative path for static serving
    }

    // Helper: Get all directories in a path
    private getDirectories(source: string): string[] {
        return readdirSync(source).filter(name =>
            statSync(join(source, name)).isDirectory()
        );
    }

    // Helper: Get all files in a path
    private getFiles(source: string): string[] {
        return readdirSync(source).filter(name =>
            statSync(join(source, name)).isFile()
        );
    }
}

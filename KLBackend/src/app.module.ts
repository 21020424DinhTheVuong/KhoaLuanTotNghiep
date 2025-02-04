import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import helmet from "helmet"
import { ConfigModule } from "@nestjs/config"
import { DataSource, } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Authentication/auth.module';
import { Account } from './entities/account.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BooksController } from './modules/books/books.controller';
import { BooksService } from './modules/books/books.service';
import { BooksModule } from './modules/books/books.module';
import { Book } from './entities/book.entity';
import { GenresController } from './modules/genres/genres.controller';
import { GenresService } from './modules/genres/genres.service';
import { GenresModule } from './modules/genres/genres.module';
import { Chapter } from './entities/chapter.entity';
import { Genre } from './entities/genre.entity';
import { BookGenre } from './entities/book_genre.entity';
import { Page } from './entities/pages.entity';
import { Favourite } from './entities/favourite.entity';
import { AccountsModule } from './modules/Accounts/accounts.module';
import { CommentBook } from './entities/comment_book.entity';
import { CommentReply } from './entities/comment_reply.entity';
import { CommentModule } from './modules/CommentBook/comment.module';
import { PostEntity } from './entities/post.entity';
import { ReplyPost } from './entities/reply_post.entity';
import { PostModule } from './modules/Post/post.module';
import { ReplyPostChildren } from './entities/reply_post_children.entity';
import { ReportController } from './modules/report/report.controller';
import { ReportService } from './modules/report/report.service';
import { ReportModule } from './modules/report/report.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'khoaluan',
      // entities: [Account, Book, Chapter, Genre, BookGenre, Page, Favourite, CommentBook, CommentReply, PostEntity, ReplyPost, ReplyPostChildren],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // logging: ["query", 'error'],
      // logger: 'advanced-console',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images', // URL prefix to serve files

    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL prefix to serve files

    }),
    AuthModule,
    BooksModule,
    GenresModule,
    AccountsModule,
    CommentModule,
    PostModule,
    ReportModule
    // AccountsModule,

  ],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule {
  constructor(private dataSource: DataSource) {

  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        helmet({
          crossOriginOpenerPolicy: { policy: 'unsafe-none' }, // Allows communication
          crossOriginResourcePolicy: { policy: 'cross-origin' }, // Customize as needed

        }),
      )
      .forRoutes('*');
  }
}

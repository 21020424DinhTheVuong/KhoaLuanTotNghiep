import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from "@nestjs/passport"
import { AccountsService } from '../Accounts/accounts.service';
import { JwtStrategy } from './jwt.strategy';
import { Favourite } from 'src/entities/favourite.entity';
import { AccountsController } from '../Accounts/accounts.controller';
import { Book } from 'src/entities/book.entity';
import { PostEntity } from 'src/entities/post.entity';
import { ReplyPost } from 'src/entities/reply_post.entity';
import { ReplyPostChildren } from 'src/entities/reply_post_children.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Favourite, Book, PostEntity, ReplyPost, ReplyPostChildren]),
    PassportModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('REFRESH_TOKEN_KEY'),
        signOptions: { expiresIn: configService.get<string>('REFRESH_TOKEN_KEY_EXPIRED') },
      }),
    }),
  ],
  controllers: [AuthController, AccountsController],
  providers: [AuthService, AccountsService, JwtStrategy]
})
export class AuthModule { }

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/dto/register.dto';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from 'src/dto/change_password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,

        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async register(registerDto: RegisterDto): Promise<any> {
        const { username, display_name, sex, password } = registerDto;

        const userExists = await this.accountRepository.findOne({ where: { username } });
        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = this.accountRepository.create({
            username,
            display_name,
            sex,
            avatar: null,
            password: hashedPassword,
        });

        await this.accountRepository.save(user);

        return { id: user.id, username: user.username, display_name: user.display_name, sex: user.sex, avatar: user.avatar, role: user.role };
    }

    async login(loginDto: LoginDto): Promise<any> {
        const { username, password } = loginDto;

        // Check if the account exists
        const account = await this.accountRepository.findOne({ where: { username } });
        if (!account) {
            throw new Error('Wrong username or password'); // Throw an error if account not found
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            throw new Error('Wrong username or password'); // Throw an error if account not found
        }

        // Generate JWT token
        const payload = { id: account.id, username: account.username, role: account.role };
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_KEY_EXPIRED')
        })
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_KEY_EXPIRED')
        });

        return { access_token, refresh_token, account }; // Return the JWT token
    }

    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = this.jwtService.verify(refresh_token, { secret: this.configService.get<string>('REFRESH_TOKEN_KEY') });
            const newAccessToken = this.jwtService.sign(
                { id: verify.id, username: verify.username, role: verify.role },
                {
                    secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
                    expiresIn: this.configService.get<string>('ACCESS_TOKEN_KEY_EXPIRED')
                },
            );
            const verifyNewToken = this.jwtService.verify(newAccessToken, { secret: this.configService.get<string>('ACCESS_TOKEN_KEY') });
            return { access_token: newAccessToken, user: verifyNewToken };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
    async getInforWithAccessToken(access_token: string, refresh_token: string): Promise<any> {
        try {
            const verify = this.jwtService.verify(access_token, { secret: this.configService.get<string>('ACCESS_TOKEN_KEY') });
            return { accessToken: access_token, user: verify };
        } catch (error) {
            return this.refreshToken(String(refresh_token))
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<string> {
        const { userId, oldPassword, newPassword } = changePasswordDto;

        // Find user by ID
        const user = await this.accountRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if the old password is correct
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Old password is incorrect');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        // user.password = hashedPassword;
        // await this.accountRepository.save(user);
        await this.accountRepository.update(userId, {
            password: hashedPassword,
            update_at: new Date(), // Manually updating, though UpdateDateColumn also handles it
        });


        return 'Password changed successfully';
    }
}

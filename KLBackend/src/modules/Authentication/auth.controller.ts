import { Controller, Post, Body, Get, Res, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/register.dto';
import { ChangePasswordDto } from 'src/dto/change_password.dto';
import { LoginDto } from 'src/dto/login.dto';
import { Response } from 'express';
import { join } from 'path';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const user = await this.authService.register(registerDto);
        return { message: 'User registered successfully', user };
    }

    @Post("login")
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return this.authService.login(loginDto)
    }

    @Post('refresh-token')
    async refreshToken(@Body('refresh_token') refresh_token: string): Promise<any> {
        return this.authService.refreshToken(refresh_token);
    }

    @Post("access-token")
    async getInforWithAccessToken(@Body('access_token') access_token: string, @Body("refresh_token") refresh_token: string): Promise<any> {
        return this.authService.getInforWithAccessToken(access_token, refresh_token)
    }
    @Get(':imageName')
    getImage(@Res() res: Response, @Param('imageName') imageName: string) {
        const imagePath = join(__dirname, '..', '..', 'public', 'images', imageName);
        return res.sendFile(imagePath); // Sends the image as a file response
    }

    // @UseGuards(AuthGuard)
    @Patch('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(changePasswordDto);
    }
}

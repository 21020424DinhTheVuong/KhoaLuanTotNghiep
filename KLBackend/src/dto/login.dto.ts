// src/modules/authentication/register.dto.ts
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;
}

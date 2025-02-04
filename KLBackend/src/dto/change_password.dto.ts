import { IsNumber, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsNumber()
    userId: number;

    @IsString()
    oldPassword: string;

    @IsString()
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    newPassword: string;
}

import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

// report.dto.ts
export class CreateReportDto {
    @IsNotEmpty()
    @IsNumber()
    reporterId: number;   // ID of the user who is reporting

    @IsNotEmpty()
    @IsNumber()
    reportedId: number;   // ID of the user being reported

    @IsOptional()
    postId?: string;      // Post ID (optional)

    @IsOptional()
    replyPostId?: string; // Reply Post ID (optional)

    @IsOptional()
    replyPostChildrenId?: string; // Reply Post Children ID (optional)

    @IsNotEmpty()
    @IsString()
    reasonReport: string; // Reason for reporting
}

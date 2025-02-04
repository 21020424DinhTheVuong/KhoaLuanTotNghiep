import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from 'src/dto/report.dto';

@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Post('create')
    async createReport(@Body() createReportDto: CreateReportDto) {
        return this.reportService.createReport(createReportDto);
    }
}

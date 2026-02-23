import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('records')
@UseGuards(JwtAuthGuard)
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) { }

    @Get()
    findAll() {
        return this.recordsService.findAll();
    }

    @Post()
    create(@Body() recordData: any) {
        return this.recordsService.create(recordData);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.recordsService.delete(id);
    }
}

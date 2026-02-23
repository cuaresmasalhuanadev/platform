import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MoneyService } from './money.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('money')
@UseGuards(JwtAuthGuard)
export class MoneyController {
    constructor(private readonly moneyService: MoneyService) { }

    @Get()
    findAll() {
        return this.moneyService.findAll();
    }

    @Post()
    create(@Body() transactionData: any) {
        return this.moneyService.create(transactionData);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.moneyService.delete(id);
    }
}

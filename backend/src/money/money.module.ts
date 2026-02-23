import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
    providers: [MoneyService],
    controllers: [MoneyController],
})
export class MoneyModule { }

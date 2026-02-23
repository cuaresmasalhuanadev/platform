import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';

@Injectable()
export class MoneyService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) { }

    async findAll(): Promise<Transaction[]> {
        return this.transactionModel.find().sort({ date: -1 }).exec();
    }

    async create(transactionData: any): Promise<Transaction> {
        const newTransaction = new this.transactionModel(transactionData);
        return newTransaction.save();
    }

    async delete(id: string): Promise<any> {
        return this.transactionModel.findByIdAndDelete(id).exec();
    }
}

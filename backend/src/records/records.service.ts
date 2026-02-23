import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from '../schemas/record.schema';

@Injectable()
export class RecordsService {
    constructor(@InjectModel(Record.name) private recordModel: Model<Record>) { }

    async findAll(): Promise<Record[]> {
        return this.recordModel.find().exec();
    }

    async create(recordData: any): Promise<Record> {
        const newRecord = new this.recordModel(recordData);
        return newRecord.save();
    }

    async delete(id: string): Promise<any> {
        return this.recordModel.findByIdAndDelete(id).exec();
    }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { Record, RecordSchema } from '../schemas/record.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }])],
    providers: [RecordsService],
    controllers: [RecordsController],
})
export class RecordsModule { }

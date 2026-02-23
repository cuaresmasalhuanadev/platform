import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
    INCOME = 'INGRESO',
    EXPENSE = 'GASTO',
}

@Schema({ timestamps: true })
export class Transaction extends Document {
    @Prop({ required: true, enum: TransactionType })
    type: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    platform: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    opNumber: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    depositMethod: string;

    @Prop({ required: true })
    cardType: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Record extends Document {
  @Prop({ required: true })
  userOrEmail: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);

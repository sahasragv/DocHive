import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = CompanyDocument & MongooseDocument;

@Schema({ timestamps: true })
export class CompanyDocument {
  @Prop({ required: true })
  originalName!: string;

  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  path!: string;

  @Prop({ required: true })
  mimetype!: string;

  @Prop({ required: true })
  size!: number;

  @Prop({ required: true })
  uploadedBy!: string;

  @Prop({ default: 'uploaded' })
  status!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const DocumentSchema =
  SchemaFactory.createForClass(CompanyDocument);
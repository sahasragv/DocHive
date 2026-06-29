import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentChunkDocument =
  HydratedDocument<DocumentChunk>;

@Schema({
  timestamps: true,
})
export class DocumentChunk {
  @Prop({
    type: Types.ObjectId,
    ref: 'CompanyDocument',
    required: true,
  })
  documentId!: Types.ObjectId;

  @Prop({
    required: true,
  })
  chunkIndex!: number;

  @Prop({
    required: true,
  })
  text!: string;

  @Prop({
    default: null,
  })
  embedding?: number[];
}

export const DocumentChunkSchema =
  SchemaFactory.createForClass(DocumentChunk);
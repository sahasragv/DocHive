import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EmbeddingStatus } from 'src/embeddings/enums/embedding-status.enum';

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
    enum: EmbeddingStatus,
    default: EmbeddingStatus.PENDING,
  })
  embeddingStatus!: EmbeddingStatus;

  @Prop({
    default: null,
  })
  vectorId?: string;
}

export const DocumentChunkSchema =
  SchemaFactory.createForClass(DocumentChunk);
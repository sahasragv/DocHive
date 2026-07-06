import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { EmbeddingStatus } from '../embeddings/enums/embedding-status.enum';

import {
  DocumentChunk,
  DocumentChunkDocument,
} from './schemas/document-chunk.schema';

@Injectable()
export class DocumentChunkService {
  private readonly logger = new Logger(DocumentChunkService.name);

  constructor(
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,
  ) {}

  /**
   * Get all chunks for a document in the correct order
   */
  async findByDocumentId(
    documentId: string,
  ): Promise<DocumentChunkDocument[]> {
    return this.chunkModel
      .find({
        documentId: new Types.ObjectId(documentId),
      })
      .sort({ chunkIndex: 1 })
      .exec();
  }

  /**
   * Update embedding status for a single chunk
   */
  async updateEmbeddingStatus(
    chunkId: string,
    status: EmbeddingStatus,
  ): Promise<void> {
    await this.chunkModel.updateOne(
      { _id: chunkId },
      {
        embeddingStatus: status,
      },
    );
  }

  /**
   * Update embedding status for all chunks in a document
   */
  async updateManyEmbeddingStatus(
    documentId: string,
    status: EmbeddingStatus,
  ): Promise<void> {
    const objectId = new Types.ObjectId(documentId);

    await this.chunkModel.updateMany(
      {
        documentId: objectId,
      },
      {
        embeddingStatus: status,
      },
    );
  }

  /**
   * Save the vector database ID for a chunk
   */
  async updateVectorId(
    chunkId: string,
    vectorId: string,
  ): Promise<void> {
    await this.chunkModel.updateOne(
      { _id: chunkId },
      {
        vectorId,
      },
    );
  }
  /**
   * Delete all chunks belonging to a document
   */
  async deleteByDocumentId(
    documentId: string,
  ): Promise<void> {
    await this.chunkModel.deleteMany({
      documentId: new Types.ObjectId(documentId),
    });
  }
}
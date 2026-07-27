import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  DocumentChunk,
  DocumentChunkDocument,
} from '../documents/schemas/document-chunk.schema';
import { EmbeddingStatus } from '../embeddings/enums/embedding-status.enum';
import {
  VectorDocument,
  VectorSearchResult,
} from './interfaces/vector.provider';

@Injectable()
export class VectorService {
  private readonly logger = new Logger(VectorService.name);

  constructor(
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,
  ) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    if (!documents.length) {
      return;
    }

    const validDocuments = documents.filter(
      (document) =>
        Array.isArray(document.embedding) &&
        document.embedding.length > 0,
    );

    if (!validDocuments.length) {
      return;
    }

    await this.chunkModel.bulkWrite(
      validDocuments.map((document) => ({
        updateOne: {
          filter: {
            _id: new Types.ObjectId(document.id),
          },
          update: {
            $set: {
              embedding: document.embedding,
              embeddingStatus: EmbeddingStatus.COMPLETED,
            },
          },
        },
      })),
    );
  }

  async delete(ids: string[]): Promise<void> {
    if (!ids.length) {
      return;
    }

    await this.chunkModel.updateMany(
      {
        _id: {
          $in: ids.map((id) => new Types.ObjectId(id)),
        },
      },
      {
        $set: {
          embedding: [],
        },
      },
    );
  }

  async similaritySearch(
    embedding: number[],
    topK = 5,
  ): Promise<VectorSearchResult[]> {
    if (!embedding?.length) {
      return [];
    }

    const results = await this.chunkModel.aggregate([
      {
        $vectorSearch: {
          index: 'document_chunk_vector_index',
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 50,
          limit: topK,
        },
      },
      {
        $project: {
          _id: 1,
          documentId: 1,
          chunkIndex: 1,
          text: 1,
          score: {
            $meta: 'vectorSearchScore',
          },
        },
      },
    ]);

    return results.map((chunk) => ({
      id: chunk._id.toString(),
      score: chunk.score ?? 0,
      document: chunk.text,
      metadata: {
        documentId: chunk.documentId?.toString(),
        chunkIndex: chunk.chunkIndex,
      },
    }));
  }
}
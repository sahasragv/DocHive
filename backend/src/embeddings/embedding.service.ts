import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { OllamaProvider } from './providers/ollama/ollama.provider';
import { EmbeddingStatus } from './enums/embedding-status.enum';
import { VectorService } from '../vector/vector.service';

import {
  DocumentChunk,
  DocumentChunkDocument,
} from '../documents/schemas/document-chunk.schema';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,

    private readonly ollamaProvider: OllamaProvider,

    private readonly vectorService: VectorService,
  ) {}

  async processDocument(documentId: string): Promise<void> {
    const objectId = new Types.ObjectId(documentId);

    try {
      this.logger.log(`Processing document ${documentId}`);

      const chunks = await this.chunkModel
        .find({
          documentId: objectId,
        })
        .sort({ chunkIndex: 1 })
        .exec();

      this.logger.log(`Loaded ${chunks.length} chunks`);

      if (!chunks.length) {
        this.logger.warn('No chunks found.');
        return;
      }

      await this.chunkModel.bulkWrite(
        chunks.map((chunk) => ({
          updateOne: {
            filter: {
              _id: chunk._id,
            },
            update: {
              $set: {
                vectorId: chunk._id.toString(),
                embeddingStatus: EmbeddingStatus.COMPLETED,
              },
            },
          },
        })),
      );

      const texts = chunks.map((chunk) => chunk.text);

      const embeddings =
        await this.ollamaProvider.generateEmbeddings(texts);
      
      await this.vectorService.upsert(
        chunks.map((chunk, index) => ({
          id: chunk._id.toString(),
          embedding: embeddings[index],
          document: chunk.text,
          metadata: {
            documentId,
            chunkIndex: chunk.chunkIndex,
          },
        })),
      );
      this.logger.log(
        'Embeddings stored in ChromaDB',
      );

      this.logger.log(
        `Generated ${embeddings.length} embeddings`,
      );

      await this.chunkModel.updateMany(
        {
          documentId: objectId,
        },
        {
          embeddingStatus: EmbeddingStatus.COMPLETED,
        },
      );
    } catch (error) {
      this.logger.error(
        'Embedding generation failed',
        error,
      );

      await this.chunkModel.updateMany(
        {
          documentId: objectId,
        },
        {
          embeddingStatus: EmbeddingStatus.FAILED,
        },
      );

      throw error;
    }
  }
}
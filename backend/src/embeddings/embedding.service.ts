import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { OllamaProvider } from './providers/ollama/ollama.provider';
import { EmbeddingStatus } from './enums/embedding-status.enum';

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

      await this.chunkModel.updateMany(
        {
          documentId: objectId,
        },
        {
          embeddingStatus: EmbeddingStatus.PROCESSING,
        },
      );

      const texts = chunks.map((chunk) => chunk.text);

      const embeddings =
        await this.ollamaProvider.generateEmbeddings(texts);

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
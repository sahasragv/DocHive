import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ConfigService } from '@nestjs/config';

import { OllamaProvider } from './providers/ollama/ollama.provider';
import { GeminiProvider } from './providers/gemini/gemini.provider';
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

    private readonly configService: ConfigService,
    private readonly ollamaProvider: OllamaProvider,
    private readonly geminiProvider: GeminiProvider,
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

      const texts = chunks.map((chunk) => chunk.text);
      const provider =
        this.configService.get<string>('AI_PROVIDER') === 'cloud'
          ? this.geminiProvider
          : this.ollamaProvider;

      const embeddings = await provider.generateEmbeddings(texts);

      if (!embeddings.length) {
        throw new Error('No embeddings were generated');
      }

      const embeddingDimension = embeddings[0]?.length;
      this.logger.log(
        `Embedding dimension: ${embeddingDimension ?? 'unknown'}`,
      );

      const invalidEmbedding = embeddings.find(
        (embedding) =>
          !Array.isArray(embedding) || embedding.length !== 768,
      );

      if (invalidEmbedding) {
        throw new Error(
          `Expected 768-dimensional embeddings but received ${embeddingDimension ?? 'unknown'}`,
        );
      }

      const chunkUpdates = chunks.flatMap((chunk, index) => {
        const embedding = embeddings[index];

        if (!Array.isArray(embedding) || !embedding.length) {
          return [];
        }

        return [
          {
            updateOne: {
              filter: {
                _id: chunk._id,
              },
              update: {
                $set: {
                  embedding,
                  vectorId: chunk._id.toString(),
                  embeddingStatus: EmbeddingStatus.COMPLETED,
                },
              },
            },
          },
        ];
      });

      if (chunkUpdates.length) {
        await this.chunkModel.bulkWrite(chunkUpdates);
      }

      this.logger.log(
        `Stored embeddings for ${chunkUpdates.length} chunk(s)`,
      );

      this.logger.log(
        `Generated ${embeddings.length} embeddings`,
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
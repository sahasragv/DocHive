import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { EmbeddingProvider } from '../embedding-provider.interface';

@Injectable()
export class GeminiProvider implements EmbeddingProvider {
  private readonly logger = new Logger(GeminiProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const model =
      this.configService.get<string>('GEMINI_EMBED_MODEL') ||
      'gemini-embedding-2-preview';

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is required for cloud embeddings',
      );
    }

    try {
      const embeddings: number[][] = [];

      for (const text of texts) {
        const response = await firstValueFrom(
          this.httpService.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`,
            {
              content: {
                parts: [{ text }],
              },
              taskType: 'RETRIEVAL_DOCUMENT',
              outputDimensionality: 768,
            },
          ),
        );

        const embedding = response.data.embedding?.values;

        if (!Array.isArray(embedding) || !embedding.length) {
          throw new Error('No embedding returned from Gemini');
        }

        embeddings.push(embedding);
      }

      return embeddings;
    } catch (error) {
      this.logger.error(
        'Failed to generate embeddings with Gemini',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Failed to generate embeddings',
      );
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const embeddings = await this.generateEmbeddings([text]);

    if (!embeddings.length) {
      throw new InternalServerErrorException(
        'No embedding returned from Gemini',
      );
    }

    return embeddings[0];
  }
}

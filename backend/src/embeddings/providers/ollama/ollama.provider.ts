import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { EmbeddingProvider } from '../embedding-provider.interface';

@Injectable()
export class OllamaProvider implements EmbeddingProvider {
  private readonly logger = new Logger(OllamaProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const baseUrl =
        this.configService.get<string>('OLLAMA_BASE_URL') ||
        'http://localhost:11434';
      const model = this.configService.get<string>('OLLAMA_EMBED_MODEL');

      this.logger.log(
        `Generating embeddings for ${texts.length} chunk(s)`,
      );

      const response = await firstValueFrom(
        this.httpService.post(`${baseUrl}/api/embed`, {
          model,
          input: texts,
        }),
      );

      return response.data.embeddings;
    } catch (error) {
      this.logger.error(
        'Failed to generate embeddings',
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
        'No embedding returned from Ollama',
      );
    }

    return embeddings[0];
  }
}
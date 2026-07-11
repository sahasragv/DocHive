import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OllamaLlmProvider {
  private readonly logger = new Logger(OllamaLlmProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generate(prompt: string): Promise<string> {
    try {
      const baseUrl =
        this.configService.get<string>('OLLAMA_BASE_URL');

      const model =
        this.configService.get<string>('OLLAMA_CHAT_MODEL');

      const response = await firstValueFrom(
        this.httpService.post(`${baseUrl}/api/generate`, {
          model,
          prompt,
          stream: false,
        }),
      );

      return response.data.response;
    } catch (error) {
      this.logger.error(
        'Failed to generate response',
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException(
        'Failed to generate response',
      );
    }
  }
}
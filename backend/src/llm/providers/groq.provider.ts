import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GroqProvider {
  private readonly logger = new Logger(GroqProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generate(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    const baseUrl =
      this.configService.get<string>('GROQ_BASE_URL') ||
      'https://api.groq.com/openai/v1';
    const model =
      this.configService.get<string>('GROQ_CHAT_MODEL') ||
      'openai/gpt-oss-20b';

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GROQ_API_KEY is required for cloud chat generation',
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${baseUrl}/chat/completions`,
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data.choices?.[0]?.message?.content ?? '';
    } catch (error) {
      this.logger.error(
        'Failed to generate response with Groq',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Failed to generate response',
      );
    }
  }
}

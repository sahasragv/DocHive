import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OllamaLlmProvider } from './providers/ollama-llm.provider';
import { GroqProvider } from './providers/groq.provider';

@Injectable()
export class LlmService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ollamaProvider: OllamaLlmProvider,
    private readonly groqProvider: GroqProvider,
  ) {}

  async generate(prompt: string): Promise<string> {
    if (this.configService.get<string>('AI_PROVIDER') === 'cloud') {
      return this.groqProvider.generate(prompt);
    }

    return this.ollamaProvider.generate(prompt);
  }
}
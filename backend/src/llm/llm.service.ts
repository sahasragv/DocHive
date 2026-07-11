import { Injectable } from '@nestjs/common';
import { OllamaLlmProvider } from './providers/ollama-llm.provider';

@Injectable()
export class LlmService {
  constructor(
    private readonly ollamaProvider: OllamaLlmProvider,
  ) {}

  async generate(prompt: string): Promise<string> {
    return this.ollamaProvider.generate(prompt);
  }
}
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LlmService } from './llm.service';
import { OllamaLlmProvider } from './providers/ollama-llm.provider';
import { GroqProvider } from './providers/groq.provider';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    LlmService,
    OllamaLlmProvider,
    GroqProvider,
  ],
  exports: [
    LlmService,
  ],
})
export class LlmModule {}
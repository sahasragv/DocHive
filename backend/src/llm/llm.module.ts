import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LlmService } from './llm.service';
import { OllamaLlmProvider } from './providers/ollama-llm.provider';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    LlmService,
    OllamaLlmProvider,
  ],
  exports: [
    LlmService,
  ],
})
export class LlmModule {}
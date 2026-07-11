import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

import { RetrievalModule } from '../retrieval/retrieval.module';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [
    RetrievalModule,
    LlmModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
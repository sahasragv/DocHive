import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dns from 'dns';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { ChatModule } from './chat/chat.module';
import { LlmModule } from './llm/llm.module';
import { VectorModule } from './vector/vector.module';
import { EmbeddingsModule } from './embeddings/embeddings.module';
import { RetrievalModule } from './retrieval/retrieval.module';

dns.setServers(['8.8.8.8', '1.1.1.1']);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGODB_URI') ||
          configService.get<string>('MONGO_URI');

        if (!uri) {
          throw new Error(
            'MONGODB_URI or MONGO_URI environment variable is required',
          );
        }

        return {
          uri,
        };
      },
    }),

    AuthModule,
    UsersModule,
    DocumentsModule,
    ChatModule,
    LlmModule,
    VectorModule,
    EmbeddingsModule,
    RetrievalModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
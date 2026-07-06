import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VectorService } from './vector.service';
import { ChromaProvider } from './providers/chroma.provider';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    VectorService,
    ChromaProvider,
  ],
  exports: [
    VectorService,
    ChromaProvider,
  ],
})
export class VectorModule {}
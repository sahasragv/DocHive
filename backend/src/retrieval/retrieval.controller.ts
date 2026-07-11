import { Body, Controller, Post } from '@nestjs/common';

import { RetrievalService } from './retrieval.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('retrieval')
export class RetrievalController {
  constructor(
    private readonly retrievalService: RetrievalService,
  ) {}

  @Post('search')
  async search(
    @Body() dto: SearchQueryDto,
  ) {
    return this.retrievalService.search(dto.query);
  }
}
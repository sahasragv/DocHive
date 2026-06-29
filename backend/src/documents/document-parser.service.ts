import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';

@Injectable()
export class DocumentParserService {

  async extractText(filePath: string): Promise<string> {

    if (filePath.endsWith('.docx')) {
      return this.extractDocx(filePath);
    }

    throw new Error('Currently only DOCX is supported');
  }

  private async extractDocx(
    filePath: string,
  ): Promise<string> {

    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return result.value;
  }
}
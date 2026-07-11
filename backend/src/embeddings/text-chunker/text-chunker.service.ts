import { Injectable } from '@nestjs/common';

@Injectable()
export class TextChunkerService {
  splitText(
    text: string,
    chunkSize = 800,
    overlap = 150,
  ): string[] {
    if (!text?.trim()) {
      return [];
    }

    // Normalize line endings and whitespace
    const normalizedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .trim();

    // Split into paragraphs
    const paragraphs = normalizedText
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    const chunks: string[] = [];

    let currentChunk = '';

    for (const paragraph of paragraphs) {
      // If adding this paragraph keeps us within the chunk size,
      // append it to the current chunk.
      if (
        currentChunk.length + paragraph.length + 2 <= chunkSize
      ) {
        currentChunk = currentChunk
          ? `${currentChunk}\n\n${paragraph}`
          : paragraph;

        continue;
      }

      // Save the completed chunk
      if (currentChunk) {
        chunks.push(currentChunk);
      }

      // Paragraph is larger than the chunk size.
      // Split it into overlapping pieces.
      if (paragraph.length > chunkSize) {
        let start = 0;

        while (start < paragraph.length) {
          const end = Math.min(
            start + chunkSize,
            paragraph.length,
          );

          chunks.push(paragraph.slice(start, end));

          start += chunkSize - overlap;
        }

        currentChunk = '';
      } else {
        currentChunk = paragraph;
      }
    }

    // Push the final chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }
}
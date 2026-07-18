import { Injectable } from '@nestjs/common';

import { RetrievalService } from '../retrieval/retrieval.service';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly retrievalService: RetrievalService,
    private readonly llmService: LlmService,
  ) {}

  async chat(question: string) {
    const retrieval = await this.retrievalService.search(question);

    const uniqueResults = retrieval.results.filter(
      (result, index, self) =>
        index ===
        self.findIndex(
          (r) =>
            r.documentId === result.documentId &&
            r.chunkIndex === result.chunkIndex,
        ),
    );

    const selectedResults = uniqueResults.slice(0, 3);

    console.log('Retrieved Results:');
    console.dir(uniqueResults, { depth: null });

    const context = selectedResults
      .map(
        (r, index) => `Document ${index + 1}:\n${r.document}`,
      )
      .join('\n\n');

    const prompt = `
You are DocHive AI, an enterprise knowledge assistant.

Use ONLY the information provided in the context.

Rules:
- Answer the user's question directly.
- Do not start with phrases like "The answer is" or "According to the context".
- Be concise.
- Use complete sentences.
- If the answer is not available, reply exactly:
"I couldn't find that information in the uploaded documents."

Context:
${context}

Question:
${question}

Answer:
`;

    const answer = await this.llmService.generate(prompt);

    return {
      answer,
      sources: selectedResults.map((result) => ({
        documentId: result.documentId,
        chunkIndex: result.chunkIndex,
        score: result.score,
      })),
    };
  }
}
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
    // Retrieve relevant document chunks
    const retrieval = await this.retrievalService.search(question);

    // Remove duplicate chunks (same content)
    const uniqueResults = retrieval.results.filter(
      (result, index, self) =>
        index ===
        self.findIndex(
          (r) => r.document === result.document,
        ),
    );

    // Use only the top 3 unique chunks
    const selectedResults = uniqueResults.slice(0, 3);

    // Build context for the LLM
    const context = selectedResults
      .map(
        (r, index) => `Document ${index + 1}:\n${r.document}`,
      )
      .join('\n\n');
    // Build the RAG prompt
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
    console.log('================ PROMPT ================');
    console.log(prompt);
    console.log('========================================');
    // Generate answer from TinyLlama
    const answer = await this.llmService.generate(prompt);
    console.log('================ ANSWER ================');
    console.log(answer);
    console.log('========================================');
    return {
      question,
      answer,
      sources: selectedResults.map((result) => ({
        documentId: result.documentId,
        chunkIndex: result.chunkIndex,
      })),
    };
  }
}
export interface EmbeddingProvider {
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}
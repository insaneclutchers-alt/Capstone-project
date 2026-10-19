import { OllamaEmbeddings } from '@langchain/ollama';

const embeddingModel = new OllamaEmbeddings({
  model: 'qwen3-embedding:4b',
  baseUrl: 'http://localhost:11434',
});

export async function generateChunkEmbeddings(eventId, listOfChunks) {
  if (!eventId || !Array.isArray(listOfChunks) || listOfChunks.length === 0) {
    throw new Error('Event ID and non-empty array of chunks are required!!');
  }

  for (const chunk of listOfChunks) {
    if (typeof chunk !== 'string') {
      throw new Error('Chunk type should be string');
    }

    if (chunk.trim() === '') {
      throw new Error('Chunks cannot be empty');
    }
  }

  const listOfChunkAndEmbeddings = [];

  for (const [index, chunk] of listOfChunks.entries()) {
    const chunkText = chunk.trim();
    const embedding = await embeddingModel.embedQuery(chunkText);

    listOfChunkAndEmbeddings.push({
      eventId,
      chunkText,
      chunkIndex: index,
      embedding,
    });
  }

  return listOfChunkAndEmbeddings;
}
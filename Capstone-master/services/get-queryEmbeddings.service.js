import { OllamaEmbeddings } from '@langchain/ollama';

const embeddingModel = new OllamaEmbeddings({
  model: 'qwen3-embedding:4b',
  baseUrl: 'http://localhost:11434',
});

export async function generateQueryEmbeddings(query) {

    //verifications
    if(query.trim()===""){
        throw new Error("Query cannot be Empty")
    }
    if(typeof query !== "string"){
        throw new Error("Query should be a string")
    }

    //generate Embeddings
    const queryText=query.trim()
    const queryEmbedding=await embeddingModel.embedQuery(queryText)

    return queryEmbedding
}
import { chunkModel } from '../backend/chunk.model.js';
import { generateQueryEmbeddings } from '../services/get-queryEmbeddings.service.js';
import { generateRagAnswer } from '../services/llm.service.js';

export async function performSemanticSearch(query) {
    const queryEmbedding = await generateQueryEmbeddings(query.trim());

    const semanticSearchResults = await chunkModel.aggregate([
        {
            $vectorSearch: {
                index: 'article_vector_index',
                path: 'embedding',
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: 10,
            },
        },
        {
            $project: {
                articleId: 1,
                chunkIndex: 1,
                chunkText: 1,
                score: { $meta: 'vectorSearchScore' },
            },
        },
    ]);

    const answer = await generateRagAnswer(query, semanticSearchResults);
    return { answer, semanticSearchResults };
}
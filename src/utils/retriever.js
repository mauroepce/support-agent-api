const { ReadableStream: ReadableStreamPolyfill } = require('web-streams-polyfill');
global.ReadableStream = ReadableStreamPolyfill;

const { openAIApiKey } = require('../config/envs')
const { clientSupabase: client } = require('../config/supabaseClient')
const { OpenAIEmbeddings } = require('@langchain/openai');
const { SupabaseVectorStore } = require('langchain/vectorstores/supabase');

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
// 1.- new instance of the supabase vector store in a const
// 2.- we're going to pass it our embeddings model and config object

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
})

// We want actually to retrieve something

const retriever = vectorStore.asRetriever()

module.exports = retriever


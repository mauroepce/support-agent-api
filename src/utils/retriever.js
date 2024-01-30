const { ReadableStream: ReadableStreamPolyfill } = require('web-streams-polyfill');
global.ReadableStream = ReadableStreamPolyfill;
require('dotenv').config(); 

const { createClient } = require('@supabase/supabase-js');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { SupabaseVectorStore } = require('langchain/vectorstores/supabase');

const openAIApiKey = process.env.OPENAI_API_KEY
const sbApiKey = process.env.SUPABASE_API_KEY
const sbUrl = process.env.SUPABASE_URL_LC_AGENT

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const client = createClient(sbUrl, sbApiKey)

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


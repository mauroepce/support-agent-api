const fs = require('fs').promises;
const { ReadableStream: ReadableStreamPolyfill } = require('web-streams-polyfill');
global.ReadableStream = ReadableStreamPolyfill;
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { SupabaseVectorStore } = require('langchain/vectorstores/supabase');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });


const sbApiKey = process.env.SUPABASE_API_KEY
const sbUrl = process.env.SUPABASE_URL_LC_AGENT
const openAIApiKey = process.env.OPENAI_API_KEY

const main = async () => {

    try {
        const result = await fs.readFile('./test_birdi_docs.txt', 'utf8')
    
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            separators: ['\n\n', '\n', ' ', '']
        })
    
        const output = await splitter.createDocuments([result])

        console.log(output);

        const client = createClient(sbUrl, sbApiKey)

       await SupabaseVectorStore.fromDocuments(
            output,
            new OpenAIEmbeddings({ openAIApiKey }),
            {
                client,
                tableName: 'documents'
            }
        )

    } catch (error) {
        console.log('There was an error trying to store on supabase: ', error);
    }
}

main()
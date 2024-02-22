const fs = require('fs').promises
const {
  ReadableStream: ReadableStreamPolyfill
} = require('web-streams-polyfill')
global.ReadableStream = ReadableStreamPolyfill
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const { SupabaseVectorStore } = require('langchain/vectorstores/supabase')
const { OpenAIEmbeddings } = require('@langchain/openai')
const { clientSupabase } = require('../src/config/supabaseClient')
const { openAIApiKey } = require('../src/config/envs')

const main = async () => {
  try {
    const result = await fs.readFile(__dirname + '/test_birdi_docs.txt', 'utf8')

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ['\n\n', '\n', ' ', '']
    })

    const output = await splitter.createDocuments([result])
    console.log(output)

    await SupabaseVectorStore.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client: clientSupabase,
        tableName: 'documents'
      }
    )
  } catch (error) {
    console.log(
      'There was an error trying to store on supabase: ',
      error.message
    )
  }
}

main()

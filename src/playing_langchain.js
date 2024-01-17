const { ReadableStream: ReadableStreamPolyfill } = require('web-streams-polyfill');
global.ReadableStream = ReadableStreamPolyfill;

require('dotenv').config();
const {
    ChatPromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
  } = require("langchain/prompts");
  const {BaseOutputParser} = require("langchain/schema/output_parser")
 const {OpenAI} = require("langchain/llms/openai")
 const {ChatOpenAI} = require("langchain/chat_models/openai")

 const llm = new OpenAI({
    openAIApiKey: process.env.OPEN_API_KEY,
    temperature: 0.9,
 })

 const chatModel = new ChatOpenAI({ openAIApiKey: process.env.OPEN_API_KEY })


  async function main() {

      const systemTemplate = "You are a helpful assistant that helps people to take good decisions";
    
      const humanTemplate = "{text}";
    
      const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["human", humanTemplate]
      ]);
    
      const formattedChatPtomt = await chatPrompt.formatMessages({
        text: "I don´t know if I need to study Data science or Computer Science",
      });
      // console.log(formattedChatPtomt)

      /* USING llm.predict */

      // const llmRsult = await llm.predict(formattedChatPtomt)
      // console.log('llmResult', llmRsult);

      /* USING llm.predictMessages */

      const llmRsult = await llm.predictMessages(formattedChatPtomt)
      // console.log('llmResult', llmRsult);
      

      // const chatModelResult = await chatModel.predictMessages(formattedChatPtomt)
      // console.log('chatModelResult', chatModelResult);

      /* USING Output parsers */
      class CommaSeparatedListOutputParser extends BaseOutputParser {
        async parse(text) {
          return text.split(",").map((item) => item.trim());
        }
      }

      const parser = new CommaSeparatedListOutputParser();

      const result = await parser.parse(llmRsult.content)

      console.log('result', result);
      
  }

  main().catch(console.error)
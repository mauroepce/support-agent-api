const { ReadableStream: ReadableStreamPolyfill } = require('web-streams-polyfill');
global.ReadableStream = ReadableStreamPolyfill;
require('dotenv').config({ path: '../.env' }); // Ajusta la ruta relativa según sea necesario

const { ChatOpenAI } = require("langchain/chat_models/openai")
const { PromptTemplate } = require("langchain/prompts");
const { StringOutputParser } = require('langchain/schema/output_parser');
const { RunnableSequence, RunnablePassthrough } = require('langchain/schema/runnable');
const retriever = require('./utils/retriever');
const formatConvHistory = require('./utils/formatConvHistory');


const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })


const main = async (userQuery) => {
    try {

        const convHistory = []
        
        const standaloneQuestionTemplate = `Given a question, Analyzes if the question has already been asked in this conversation history: (${formatConvHistory(convHistory)})if so, respond cordially that the question has just been answered, and if you have any doubts about it, otherwise. Question: {question} standalone question:`
        
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

        const concept = `Birdi es una app marketplace de compra y venta mucho más seguro, cómodo y fácil de usar que las soluciones existentes. A diferencia de otras plataformas, Birdi ha creado su propio sistema eficiente de logística de última milla, conectando una flota de transportistas o repartidores con nuestros usuarios.
        `

        const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Birdi app (${concept}) based on the context provided. Try to find the answer in the context and make it shorter  and concise. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@sbirdi.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
        context: {context}
        question: {question}
        asnwer:
        `

        const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

        // Runnable sequences
            const standaloneQuestionChain = RunnableSequence.from([
                standaloneQuestionPrompt,
                llm,
                new StringOutputParser()
            ])

            const retrieverChain = RunnableSequence.from([
                prevResult => prevResult.standalone_question,
                retriever,
                new StringOutputParser()
            ])

            const answerChain = RunnableSequence.from([
                answerPrompt,
                llm,
                new StringOutputParser
            ])
        
        const chain = RunnableSequence.from([
            {
                standalone_question: standaloneQuestionChain,
                original_input: new RunnablePassthrough()
            },
            {
                context: retrieverChain,
                question: ({ original_input }) => original_input.question
            },
            answerChain

        ])
        
        const response = await chain.invoke({
            question: userQuery
        })
        // retrieve End Here
        convHistory.push(userQuery)
        convHistory.push(response)
        const formatHistory = formatConvHistory(convHistory)
        console.log(formatHistory);

        return response

    } catch (error) {
        console.log('There was an error trying to execute the response of the chain');
    }
}

module.exports = { main }
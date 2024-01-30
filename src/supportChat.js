const { ReadableStream: ReadableStreamPolyfill } = require('web-streams-polyfill');
global.ReadableStream = ReadableStreamPolyfill;
require('dotenv').config({ path: '../.env' }); // Ajusta la ruta relativa según sea necesario

const { ChatOpenAI } = require("langchain/chat_models/openai")
const { PromptTemplate } = require("langchain/prompts");
const { StringOutputParser } = require('langchain/schema/output_parser');
const { RunnableSequence, RunnablePassthrough } = require('langchain/schema/runnable');
const retriever = require('./utils/retriever');


const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })


const main = async (userQuery) => {
    try {
        
        const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. Question: {question} standalone question:'
        
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

        const concept = `Birdi es una app marketplace de compra y venta mucho más seguro, cómodo y fácil de usar que las soluciones existentes. A diferencia de otras plataformas, Birdi ha creado su propio sistema eficiente de logística de última milla, conectando una flota de transportistas o repartidores con nuestros usuarios.
        ¡Es seguro! Reducimos las estafas mediante un procedimiento único que nuestros repartidores deben cumplir cada vez que retiran y entregan un producto. 
        ¡Es Increíble! Ahora comprador y vendedor pueden elegir la hora y el día disponibles para el retiro y entrega de manera muy sencilla sin tener que moverse de donde esten.`

        const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Birdi (${concept}) app based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@sbirdi.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
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

        return response

    } catch (error) {
        console.log('There was an error trying to execute the response of the chain');
    }
}

module.exports = { main }
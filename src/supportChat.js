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

const convHistory = []

const main = async (userQuery) => {
    try {
        
        const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question
        conversation history: {conv_history}
        question: {question} 
        standalone question:`
        
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

        const concept = `Birdi es una app marketplace de compra y venta mucho más seguro, cómodo y fácil de usar que las soluciones existentes. A diferencia de otras plataformas, Birdi ha creado su propio sistema eficiente de logística de última milla, conectando una flota de transportistas o repartidores con nuestros usuarios.
        `

        const answerTemplate = `Como bot de soporte entusiasta y útil, puedo responder preguntas sobre la app Birdi (${concept}) con base en el contexto y el historial de conversación. Ten en cuenta lo siguiente antes de responder:
        1.- Si ya se respondió, indica que ya se ha contestado y pregunta cómo podemos ayudar si aún hay dudas.
        2.- Busca dar una respuesta breve y precisa usando el contexto.
        3.- Si no se encuentra en el contexto, revisa el historial de la conversación.
        4.- Si desconoces la respuesta, di "Lo siento, no tengo la respuesta a eso" y sugiere contactar a help@birdi.com.
        5.- No inventes respuestas.
        6.- Habla como si estuvieras conversando con un amigo.
        context: {context}
        conversation history: {conv_history}
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
                question: ({ original_input }) => original_input.question,
                conv_history: ({ original_input }) => original_input.conv_history
            },
            answerChain

        ])
        
        const response = await chain.invoke({
            question: userQuery,
            conv_history: formatConvHistory(convHistory)
        })
        // retrieve End Here
        convHistory.push(userQuery)
        convHistory.push(response)

        console.log('convHistory', formatConvHistory(convHistory));

        return response

    } catch (error) {
        console.log('There was an error trying to execute the response of the chain');
    }
}

module.exports = { main }
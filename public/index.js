


document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault()
    progressConversation()
})

async function progressConversation() {
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    const question = userInput.value
    userInput.value = ''

    // add human message
    const newHumanSpeechBubble = document.createElement('div')
    newHumanSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newHumanSpeechBubble)
    newHumanSpeechBubble.textContent = question
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    
    // Send the question to the server and request for response
    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-type': 'application/json '},
        body: JSON.stringify({ query: question })
    })
    const data = await response.json()

    // add AI message
    const newAiSpeechBubble = document.createElement('div')
    newAiSpeechBubble.classList.add('speech', 'speech-ai')
    newAiSpeechBubble.textContent = data.reply;  
    chatbotConversation.appendChild(newAiSpeechBubble)
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}
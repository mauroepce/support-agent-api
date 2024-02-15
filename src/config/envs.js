require('dotenv').config({ path: '../.env' })

module.exports = {
  sbApiKey: process.env.SUPABASE_API_KEY,
  sbUrl: process.env.SUPABASE_URL_LC_AGENT,
  openAIApiKey: process.env.OPENAI_API_KEY
}
const { createClient } = require('@supabase/supabase-js')
const { sbApiKey, sbUrl } = require('./envs')

module.exports = {
  clientSupabase: createClient(sbUrl, sbApiKey)
}

const express = require('express')
const path = require('path')
const { main } = require('./supportChat')
const app = express()

// Sirve los archivos estáticos desde la carpeta 'src'
// app.use(express.static(path.join(__dirname, '.')))
app.use(express.static('public'))
app.use(express.json()) // Middleware to parse json

app.post('/chat', async (req, res) => {
  const userQuery = req.body.query
  const response = await main(userQuery)
  console.log(response);
  res.json({ reply: response })
})

// Ruta principal que sirve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Manejador de errores para las funciones asincronas
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    error: true,
    message: err?.message
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})

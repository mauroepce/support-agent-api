const express = require('express');
const path = require('path');
const app = express();

// Sirve los archivos estáticos desde la carpeta 'src'
app.use(express.static(path.join(__dirname, '.')));

// Ruta principal que sirve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

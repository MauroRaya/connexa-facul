const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const usuariosRouter = require('./routes/usuarios');

app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

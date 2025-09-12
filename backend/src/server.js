const express = require('express')
const app = express()
const port = 3000

const userController = require('./controllers/user-controller.js');

app.use('/user', userController.getUsers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

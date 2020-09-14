const express = require('express')
const app = express()
const port = 3000

// MongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ohdnf:q1w2e3r4@boiler-plate.pxzmy.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
  .then(() => {
    console.log('MongoDB connected...')
  })
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
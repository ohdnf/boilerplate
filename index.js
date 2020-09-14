const express = require('express')
const app = express()
const port = 3000

const { User } = require('./models/User')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

app.post('/signup', (req, res) => {
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
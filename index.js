const express = require('express')
const app = express()
const port = 3000

const cookieParser = require('cookie-parser')

const config = require('./config/key')
const { User } = require('./models/User')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// MongoDB
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
  .then(() => {
    console.log('MongoDB connected...')
  })
  .catch(err => console.log(err))

// Router 정의
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

app.post('/login', (req, res) => {
  // 유저 확인
  User.findOne({email: req.body.email}, (res, user) => {
    if (!user) {
      // 비회원
      return res.json({
        loginSuccess: false,
        message: "로그인에 실패하였습니다."
      })
    } else {
      // 비밀번호 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          // 비밀번호 틀림
          return res.json({
            loginSuccess: false,
            message: "로그인에 실패하였습니다."
          })
        } else {
          // 비밀번호 맞음 => 토큰 생성
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err)
            // Token 저장(위치? 로컬, 세션, 쿠키 중 쿠키에 저장)
            res.cookie('x_auth', user.token)
              .status(200)
              .json({
                loginSuccess: true,
                userId: user._id
              })
          })
        }
      })
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
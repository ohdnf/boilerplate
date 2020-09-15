const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // 입력된 데이터의 공백을 제거해주는 역할
    unique: 1
  },
  password: {
    type: String,
    minlength: 8
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

// 유저 정보를 저장하기 전 처리 로직
userSchema.pre('save', function(next) {
  const user = this
  // 비밀번호를 수정할 경우
  if (user.isModified('password')) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err)
        // 해쉬화된 비밀번호 저장
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})


// 사용자 정의 메소드
userSchema.methods.comparePassword = function(plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}
userSchema.methods.generateToken = function(callback) {
  const user = this
  const token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token
  user.save(function(err, user) {
    if (err) return callback(err)
    callback(null, user)
  })
}

userSchema.statics.findByToken = function(token, callback) {
  const user = this
  // decode token
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 복호화된 유저 id를 이용해 유저 찾기
    user.findOne({ "_id": decoded, "token": token}, function(err, user) {
      if (err) return callback(err)
      callback(null, user)
    })
    
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
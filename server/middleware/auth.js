const { User } = require('../models/User')

// 인증 처리
const auth = (req, res, next) => {
  // 클라이언트에서 쿠키 가져오기
  const token = req.cookies.x_auth
  // 토큰을 복호화해 유저 찾기
  User.findByToken(token, (err, user) => {
    if (err) throw err
    if (!user) return res.status(401).json({
      isAuth: false,
      error: true
    })

    req.token = token
    req.user = user
    next()
  })

}

module.exports = { auth }
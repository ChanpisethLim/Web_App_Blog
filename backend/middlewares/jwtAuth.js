const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const priv_key = require('../keys/id_rsa_priv')

exports.issueJWT = user => {

  const payload = {
    sub: user._id,
    name: user.name,
    iat: Date.now()
  }

  const signedToken = jwt.sign(payload, priv_key, {expiresIn: '3h', algorithm: 'RS256'})

  return signedToken
  
}

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.session
  const pub_key_path = path.join(__dirname, '../keys/id_rsa_pub.pem')
  const pub_key = fs.readFileSync(pub_key_path, 'utf8')

  if(token) {
    jwt.verify(token, pub_key, (err, decodedPayload) => {
      if(err) {
        return res.status(422).json({
          msg: 'Invalid Token'
        })
      }
      else {
        req.userId = decodedPayload.sub
        next()
      }
    })
  }
  else {
    return res.status(401).json({
      msg: 'Unauthorized, login required'
    })
  }
}
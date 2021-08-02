require('dotenv').config({ path: '../.env' })

const priv_key = process.env.RSA_PRIVATE.replace(/\\n/g, '\n')

module.exports = priv_key
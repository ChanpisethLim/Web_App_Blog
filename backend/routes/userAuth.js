const router = require('express').Router()
const userAuthController = require('../controllers/userAuth')

router.post('/user/signup', userAuthController.signup)
router.get('/user/signup/verify/:id/:token', userAuthController.signupVerify)
router.post('/user/signin', userAuthController.signin)
router.get('/user/signout', userAuthController.signout)
router.post('/user/reset', userAuthController.resetPassword)
router.put('/user/reset/verify/:id/:token', userAuthController.resetPasswordVerify)


module.exports = router
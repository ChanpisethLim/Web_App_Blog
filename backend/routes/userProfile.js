const router = require('express').Router()
const userProfileController = require('../controllers/userProfile')
const { uploadImg } = require('../middlewares/multerUpload')

router.get('/profile/:id', userProfileController.getUserData)
router.patch('/auth/profile/changePassword', userProfileController.changePassword)
router.patch('/auth/profile/update', uploadImg, userProfileController.updateUserData)

module.exports = router
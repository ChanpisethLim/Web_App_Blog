const router = require('express').Router()
const blogController = require('../controllers/blog')
const { uploadImg } = require('../middlewares/multerUpload')

router.post('/auth/blog/create', uploadImg, blogController.create)
router.get('/blog', blogController.findAll)
router.get('/blog/:slug', blogController.findBySlug)
router.get('/blog/author/:id', blogController.findByAuthor)
router.get('/blog/category/:id', blogController.findByCategory)
router.patch('/auth/blog/update/:id', uploadImg, blogController.updateOne)
router.delete('/auth/blog/delete/:id', blogController.delete)
router.patch('/auth/blog/reaction/love/:id', blogController.love)
router.patch('/auth/blog/reaction/dislove/:id', blogController.disLove)

module.exports = router

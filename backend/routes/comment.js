const router = require('express').Router()
const commentController = require('../controllers/comment')

router.post('/auth/comment/create', commentController.create)
router.get('/comment', commentController.findAll)
router.patch('/auth/comment/update/:id', commentController.updateOne)
router.delete('/auth/comment/delete/:id', commentController.delete)

module.exports = router
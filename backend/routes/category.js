const router = require('express').Router()
const categoryController = require('../controllers/category')

router.post('/auth/category/create', categoryController.create)
router.get('/category', categoryController.findAll)
router.get('/category/:slug', categoryController.findBySlug)
router.patch('/auth/category/update/:id', categoryController.updateOne)
router.delete('/auth/category/delete/:id', categoryController.delete)

module.exports = router
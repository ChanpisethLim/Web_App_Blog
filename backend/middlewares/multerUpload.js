const {upload} = require('../configs/multer')
const multer = require('multer')

exports.uploadImg = (req, res, next) => {
    upload.single('image')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(406).json({
                msg: err.message
            })
        } else if (err) {
            return res.status(406).json({
                msg: err
            })
        }
        next()
    })
}
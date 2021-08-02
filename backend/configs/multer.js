const multer = require('multer')
const uuid4 = require('uuid').v4
const path = require('path')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', "/public/images"),
    filename: function (req, file, cb) 
    {
        const fullName = 'image_' + uuid4().replace(/-/g, '') + path.extname(file.originalname)
        cb(null, fullName)
    },
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // file size two milion bytes are allowed
    fileFilter: function (req, file, cb) {
        const fileTypes = /png|jpeg|jpg/
        const extName = fileTypes.test(path.extname(file.originalname.toLowerCase()))
        const mimeType = fileTypes.test(file.mimetype)
        if (extName && mimeType) {
            cb(null, true)
        } 
        else {
            cb('Error: only png, jpeg, and jpg are allowed!')
        }
    },
})


module.exports = { upload }
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    commenter: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {timestamps: true})

const Comment = mongoose.model('comment', commentSchema)
module.exports = Comment
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentModel = require('./comment')

const blogSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    lovers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
}, {timestamps: true})

// remove all comments
blogSchema.pre('remove', async function(next){
    await commentModel.remove({_id: { $in: this.comments}})
    next()
})

const Blog = mongoose.model('blog', blogSchema)
module.exports = Blog


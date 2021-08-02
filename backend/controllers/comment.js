const blogModel = require('../models/blog')
const commentModel = require('../models/comment')

exports.create = async (req, res) => {
    try 
    {
        const commentData = {
            commenter: req.userId,
            content: req.body.content
        }
        const comment = new commentModel(commentData)
        await comment.save()

        await blogModel.findByIdAndUpdate(
            req.body.blogId, 
            {$push: {comments: comment._id}},
            {new: true}
        )

        return res.status(201).json({
            msg: "Comment created"
        })
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.findAll = async (req, res) => {
    try 
    {
        const comments = await commentModel.find()
            .populate('commenter', 'name image')
            .exec()
        if(comments.length > 0) {
            return res.status(200).json(comments)
        }
        else {
            return res.status(200).json({
                msg: "No comment here"
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.updateOne = async (req, res) => {
    try 
    {
        const comment = await commentModel.findById(req.params.id).exec()
        
        if(comment) {
            if(req.userId == comment.commenter) {
                // use findByIdAndUpdate to return updated document
                const updatedComment = await commentModel.findByIdAndUpdate(comment._id, req.body, {new: true})
                    .populate('commenter', 'name image')
                    .exec()
        
                return res.status(200).json({
                    updatedComment,
                    msg: 'Comment updated'
                })
            }
            else {
                return res.status(401).json({
                    msg: 'No edit access'
                })
            }
        }
        else {
            return res.status(404).json({
                msg: "Comment not found"
            })
        }
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.delete = async (req, res) => {
    try 
    {
        const comment = await commentModel.findById(req.params.id).exec()

        if(comment) {
            if(req.userId == comment.commenter) {
                await comment.remove()

                await blogModel.findByIdAndUpdate(
                    req.body.blogId,
                    {$pull: {comments: comment._id}},
                )
        
                return res.status(200).json({
                    msg: 'Comment deleted'
                })
            }
            else {
                return res.status(401).json({
                    msg: 'No delete access'
                })
            }
        }
        else {
            return res.status(404).json({
                msg: "Comment not found"
            })
        }
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}
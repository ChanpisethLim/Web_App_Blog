const blogModel = require('../models/blog')
const fs = require('fs')
const path = require('path')

exports.create = async (req, res) => {
    try 
    {
        const data = {
            author: req.userId,
            image: req.file ? req.file.filename : '',
            ...req.body
        }
        
        const blog = new blogModel(data)
        await blog.save()

        return res.status(201).json({
            msg: 'Blog created'
        })
    } 
    catch (error) 
    {
        if(error.name === 'MongoError' &&  error.code === 11000 && error.keyPattern.slug === 1) {
            return res.status(409).json({
                msg: 'Slug already existed'
            })
        }
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.findAll = async (req, res) => {
    try 
    {
        const blog = await blogModel.find()
            .populate({path: 'author', select: 'name'})
            .populate({path: 'category', select: 'name'})
            .populate({path: 'lovers', select: 'name image'})
            .populate({path: 'comments', populate: {path: 'commenter', select: 'name image'}})
            .exec()

        if(blog.length > 0) {
            return res.status(200).json(blog)
        }
        else {
            return res.status(200).json({
                msg: "There are no blogs"
            })
        }
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.findBySlug = async (req, res) => {
    try 
    {
        const blog = await blogModel.findOne({slug: req.params.slug})
            .populate({path: 'author', select: 'name'})
            .populate({path: 'category', select: 'name'})
            .populate({path: 'lovers', select: 'name image'})
            .populate({path: 'comments', populate: {path: 'commenter', select: 'name image'}})
            .exec()

        if(!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            })
        }

        return res.status(200).json(blog)
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.findByAuthor = async (req, res) => {
    try 
    {
        const blog = await blogModel.find({author: req.params.id})
            .populate({path: 'author', select: 'name'})
            .populate({path: 'category', select: 'name'})
            .populate({path: 'lovers', select: 'name image'})
            .populate({path: 'comments', populate: {path: 'commenter', select: 'name image'}})
            .exec()

        if(blog.length > 0) {
            return res.status(200).json(blog)
        }
        else {
            return res.status(200).json({
                msg: "No blog from this author"
            })
        }    
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.findByCategory = async (req, res) => {
    try 
    {
        const blog = await blogModel.find({category: req.params.id})
            .populate({path: 'author', select: 'name'})
            .populate({path: 'category', select: 'name'})
            .populate({path: 'lovers', select: 'name image'})
            .populate({path: 'comments', populate: {path: 'commenter', select: 'name image'}})
            .exec()
    
        if(blog.length > 0) {
            return res.status(200).json(blog)
        }
        else {
            return res.status(200).json({
                msg: "No blog in this category"
            })
        }
    } 
    catch (error) {
        return res.status(500).json({
            msg: error+'An error occured'
        })
    }
        
}

exports.updateOne = async (req, res) => {
    try 
    {
        const updatedData = {
            image: req.file ? req.file.filename : '',
            ...req.body
        }
        const blog = await blogModel.findById(req.params.id).exec()
        
        if(blog) {
            if(req.userId == blog.author) {
                if(blog.image) {
                    fs.unlinkSync(path.join(__dirname, "..", "public/images", blog.image))
                }

                await blogModel.updateOne({_id: blog._id}, updatedData).exec()
        
                return res.status(200).json({
                    msg: 'Blog updated'
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
                msg: "Blog not found"
            })
        }
        
    } 
    catch (error) {
        return res.status(500).json({
            msg: error+'An error occured'
        })
    }
}

exports.delete = async (req, res) => {
    try 
    {
        const blog = await blogModel.findById(req.params.id).exec()

        if(blog) {
            if(req.userId == blog.author) {
                if(blog.image) {
                    fs.unlinkSync(path.join(__dirname, "..", "public/images", blog.image))
                }
                
                await blog.remove() // invoke pre-remove hook in blog model and remove the document
        
                return res.status(200).json({
                    msg: 'Blog deleted'
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
                msg: "Blog not found"
            })
        }
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.love = async (req, res) => {
    try 
    {
        const blog = await blogModel.findByIdAndUpdate(
            req.params.id, 
            {$addToSet: {lovers: req.userId}}, //The $addToSet ensures that there are no duplicate items added to the set
            {new: true}
        ).populate('lovers', 'name image').exec()

        console.log(blog)

        if(!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            })
        }

        return res.status(200).json(blog)
    } 
    catch (error) {
        return res.status(500).json({
            msg: "An error occured"
        })
    }  
}

exports.disLove = async (req, res) => {
    try 
    {
        const blog = await blogModel.findByIdAndUpdate(
            req.params.id, 
            {$pull: {lovers: req.userId}}, 
            {new: true}
        ).populate('lovers', 'name image').exec()

        if(!blog) {
            return res.status(404).json({
                msg: "Blog not found"
            })
        }

        return res.status(200).json({blog})
    } 
    catch (error) {
        return res.status(500).json({
            msg: "An error occured"
        })
    }  
}
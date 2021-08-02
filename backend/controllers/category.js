const categoryModel = require('../models/category')

exports.create = async (req, res) => {
    try 
    {
        const category = new categoryModel(req.body)
        await category.save()

        return res.status(201).json({
            msg: "Category created"
        })
    } 
    catch (error) {
        if(error.name === 'MongoError' &&  error.code === 11000 && error.keyPattern.slug === 1) {
            return res.status(409).json({
                msg: 'Category slug already existed'
            })
        }
        if(error.name === 'MongoError' &&  error.code === 11000 && error.keyPattern.name === 1) {
            return res.status(409).json({
                msg: 'Category name already existed'
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
        const category = await categoryModel.find().exec()
        if (category.length > 0) {
            return res.status(200).json(category)
        }
        else {
            return res.status(404).json({
                msg: "There are no categories"
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
        const category = await categoryModel.findOne({slug: req.params.slug}).exec()
        if(!category){
            return res.status(404).json({
                msg: "Category does not exist"
            })
        }

        return res.status(200).json(category)
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
        const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
        if(!category) {
            return res.status(500).json({
                msg: 'Cannot update the Category'
            })
        }

        return res.status(200).json({
            msg: 'Category updated'
        })
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
        const category = await categoryModel.findByIdAndDelete(req.params.id).exec()
        if(!category) {
            return res.status(500).json({
                msg: "Cannot delete the Category"
            })
        }    

        return res.status(200).json({
            msg: "Category deleted"
        })
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

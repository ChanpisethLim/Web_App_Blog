const userModel = require('../models/user')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const {upload} = require('../configs/multer')

exports.getUserData = async (req, res) => {
    try 
    {    
        // - sign means we are not select that field
        const userDoc = await userModel.findById(req.params.id).select('-password -verified').exec()
        if(!userDoc) {
            return res.status(500).json({
                msg: 'Cannot get user data'
            })
        }

        return res.status(200).json(userDoc)
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.updateUserData = async (req, res, err) => {
    try 
    {
        const updatedData = {
            image: req.file ? req.file.filename : '',
            ...req.body
        }

        const user = await userModel.findById(req.userId).exec()
        if(user.image) {
            fs.unlinkSync(path.join(__dirname, "..", "public/images", user.image))
        }
            
        const updatedUser = await userModel.findByIdAndUpdate(req.userId, updatedData, {new: true}).select('-password -verified').exec()
        if(!updatedUser) {
            return res.status(500).json({
                msg: 'Cannot update the Profile'
            })
        }
        
        return res.status(200).json({
            updatedUser,
            msg: 'Profile updated'
        })
    } 
    catch (error) {
        return res.status(500).json({
            msg: error+'An error occured'
        })
    }
}

exports.changePassword = async (req, res) => {
    try 
    {
        const user = await userModel.findById(req.userId).exec()
        if(!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const validate = await user.isValidPassword(req.body.currentPassword)
        if(!validate) {
            return res.status(422).json({
                msg: 'Current password is incorrect'
            })
        } 

        if(req.body.newPassword === req.body.confirmPassword){
            user.password = req.body.newPassword
            await user.save()

            return res.cookie('session', '', {maxAge: 0}).status(200).json({
                msg: "Password changed"
            })
        }
        else {
            return res.status(422).json({
                msg: "New password and confirm password must be same"
            })
        }  
    } 
    catch (error) {
        return res.status(500).json({
            msg: error+'An error occured'
        })
    }
}
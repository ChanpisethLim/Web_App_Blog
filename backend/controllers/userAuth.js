require('dotenv').config({path: '../.env'})

const crypto = require('crypto')
const userModel = require('../models/user')
const jwtAuth = require('../middlewares/jwtAuth')
const { sendEmail } = require('../utils/sendEmail')
const Token = require('../models/token')

exports.signup = async (req, res) => {
    try
    {
        // Check if user is existed
        const user = await userModel.findOne({
            'email': req.body.email
        }).exec()

        if(user){  
            return res.status(409).json({
                msg: 'User already existed'
            })
        }

        // Create a new user and send verification email
        const newUser = new userModel(req.body)
        await newUser.save() // invoke pre-save hook in user model to encypt the password

        emailSending(newUser, route = 'signVerify')

        return res.status(201).json({
            msg: 'Please check your email to verify the account'
        })

    }
    catch (error) 
    {
        return res.status(500).json({
            msg: 'An error occured'
        })
    }   
}

exports.signupVerify = async (req, res) => {
    try 
    {
        // Check if user is existed
        const user = await userModel.findById(req.params.id).exec()   
        if(!user){
            return res.status(400).json({
                msg: 'Invalid Link'
            })
        }

        // Check the token and update to verified user
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        }).exec()
        if(!token){
            return res.status(400).json({
                msg: 'Invalid Link or Token is expired'
            })
        }

        await userModel.updateOne({ _id: user._id}, {verified: true})
        await Token.deleteOne({_id: token._id})

        return res.status(200).json({
            msg: 'Account verification succeeded'
        })
    } 
    catch (error) {
        return res.status(500).json({
            msg: 'Account verification failed'
        })
    }
}

exports.signin = async (req, res) => {
    try 
    {
        // Check if user is existed
        const user = await userModel.findOne({
            'email': req.body.email
        }).exec()

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            })
        }

        // Password validation
        const validate = await user.isValidPassword(req.body.password) // invoke validate function in user model

        if(!validate){
            return res.status(422).json({
                msg: 'Incorrect password'
            })
        }

        // Check if user is verified
        if(user.verified === false) {
            emailSending(user, route = 'signVerify')
            
            return res.status(201).json({
                msg: 'Account verification required, please check your email to verify'
            })
        }

        // Issue JWT
        const signedToken  = jwtAuth.issueJWT(user)

        return res.cookie('session', signedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"? true: false,
            sameSite: 'lax',
            maxAge: 3 * 60 * 60 * 1000 // 3h in millisecond
        }).status(200).json({
            token: require('crypto').randomBytes(64).toString('hex'),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            msg: 'Logged in'
        })
    } 
    catch (error) 
    {
        res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.signout = (req, res) => {
    res.cookie('session', '', {maxAge: 0});
    return res.json({
        msg: 'Logged out'
    })
}

exports.resetPassword = async (req, res) => {
    try 
    {
        // Check if user is existed
        const user = await userModel.findOne({
            'email': req.body.email
        }).exec()

        if(!user){
            return res.status(404).json({
                msg: 'User not found'
            })
        }   
        
        emailSending(user, route = 'resetVerify')
        
        return res.status(201).json({
            msg: 'Please check your email to reset your password'
        })
    } 
    catch (error) {
        res.status(500).json({
            msg: 'An error occured'
        })
    }
}

exports.resetPasswordVerify = async (req, res) => {
    // Check if user is existed
    const user = await userModel.findById(req.params.id).exec()   
    if(!user) {
        return res.status(400).json({
            msg: 'Invalid Link'
        })
    }

    // Check the token and update to verified user
    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token
    }).exec()
    if(!token) {
        return res.status(400).json({
            msg: 'Invalid Link or Token is expired'
        })
    }

    if(req.body.resetPassword == undefined) {
        return res.status(406).json({
            msg: 'New Password is required'
        })
    }
    else if(req.body.resetPassword == '') {
        return res.status(406).json({
            msg: 'Password cannot be blank'
        })
    }
    else {
        user.password = req.body.resetPassword
        await user.save()
        await Token.deleteOne({_id: token._id})

        return res.status(200).json({
            msg: 'Password reset successfully'
    })
    }
}

emailSending = async (user, route) => {
    const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex')
    })
    await token.save()

    let subject = ''
    let message = ''

    if(route == 'signVerify') {
        subject = 'Email Verification'
        message = `Please click this link to verify your account: ${process.env.BASE_URL}/api/v1/user/signup/verify/${user._id}/${token.token}`
    }

    if(route == 'resetVerify') {
        subject = 'Reset Your Password'
        message = `Please click this link to reset your password: ${process.env.BASE_URL}/api/v1/user/reset/verify/${user._id}/${token.token}`
    }
    
    await sendEmail(user.email, subject, message)
}
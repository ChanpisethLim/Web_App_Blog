require('dotenv').config({path: '../.env'})
const nodemailer = require('nodemailer')

exports.sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        }

        await transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(info.response)
            }
        })
    }
    catch(error) {
        console.log(error)
    }
}
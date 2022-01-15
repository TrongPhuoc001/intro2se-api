const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS,
    }
})

transporter.verify().then(console.log).catch(console.error);
module.exports = (user_id,email,baseurl)=>{
    return jwt.sign({
        id:user_id,
    },process.env.TOKEN_SECRET,{
        expiresIn: '7d',
    },(err,emailToken)=>{
        const url = baseurl + emailToken;
        transporter.sendMail({
            to:email,
            subject: 'Potality Confirm Email',
            html:`Please click this link to confirm your email: <a href="${url}">${url}</a>`
        })
    })
}
const nodemailer = require('nodemailer')

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    // Create email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // Options for sending email
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    }

    // send email
    transporter.sendMail(options, function (error, info) {
        if (error) {
            console.log(error)
        }else{
            console.log(info)
        }
    })



}

module.exports = sendEmail
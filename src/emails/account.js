const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from : 'amirhossein@yahoo.com',
        subject:'thanks for joining',
        text:`welcome to the app, ${name},. let me know about the app`
    })
}

const sendGoodbyeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from : 'amirhossein@yahoo.com',
        subject:'goodbye',
        text:`goodby from the app, ${name}, anything about my app will be helpful`
    })
}
module.exports = {
    sendWelcomeEmail ,
    sendGoodbyeEmail
}

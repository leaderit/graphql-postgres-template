// EXAMPLE FOR EMAIL CHANNEL (LOGIN=VALID EMAIL ADDRESS)
// Send an authorisation code for the user via second chennel
const fp = require('fastify-plugin')
const crypto = require('crypto')

const emailFormat=/^[a-zA-Z0-9_.\-+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
const phoneFormat=/^(?:\+?\d{1,2}[ -]?[\d -][\d -]+)$/

// Send Authorisation code
const sendCode = async function (user, action, code){
    const fastify = this
    const { sendMail } = fastify
    const { config } = fastify

    // Delay before send code 
    await new Promise(resolve => setTimeout(resolve, config.auth.codeSendDelay * 1000 ));

    var email = user.email
    var phone = user.phone
    if ( emailFormat.test(user.name) ) email = user.name
    if ( phoneFormat.test(user.name) ) phone = user.phone

    // console.log( { user, email, phone })

    if ( emailFormat.test(email) ) {
        // send a code via the email
        sendMail({
            from: config.mail.admin.from,   // A Sender Address: '"Sender Name" <e-mail@domain.com>'
            to: email,                      // Receiver adresses^ comma separated: "addr1@mail.com, addr2@mail.com"
            subject: 'Confirmation code',   // Text of the topic
            text: 'Code: '+code,            // Plain text body
            html :"<b>Code: "+code+"</b>"   // Html body
        })      
    }

    if ( phoneFormat.test( phone) ) {
        // send code via phone/messanger etc

    }

    return { 
        code,
    }
}

module.exports = fp(function (fastify, opts, next) {
    // const apiMethod = api[method].bind( context )
    sendCode.bind( fastify )
    fastify.decorate ( 'sendCode', sendCode )
    next()
})


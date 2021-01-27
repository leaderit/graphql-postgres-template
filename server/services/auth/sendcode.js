// EXAMPLE FOR EMAIL CHANNEL (LOGIN=VALID EMAIL ADDRESS)
// Send an authorisation code for the user via second chennel
const fp = require('fastify-plugin')
const crypto = require('crypto')

// Send Authorisation code
const sendCode = async function (user, action, code){
    const fastify = this
    const { sendMail } = fastify
    const { config } = fastify
    // Delay before send code 
    await new Promise(resolve => setTimeout(resolve, config.auth.codeSendDelay * 1000 ));
    console.log( config.mail.admin )
    // awat 
    sendMail({
      from: config.mail.admin.from,     // адрес отправителя: '"Valeriy Grazhdankin" <ias-projects@mail.ru>'
      to: 'ias-projects@mail.ru',       // Адреса получателей: "ias-projects@mail.ru, admin@centerstruve.com"
      subject: 'Confirmation code',     // Строка темы
      text: 'Code: '+code,              // Plain text body
      html :"<b>Code: "+code+"</b>"        // Html body
    })
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


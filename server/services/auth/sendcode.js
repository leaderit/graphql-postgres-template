const fp = require('fastify-plugin')
const crypto = require('crypto')

// Запрос кода подтверждения
const sendCode = async function (user, action, code){
    const fastify = this
    const { sendMail } = fastify
    const { config } = fastify
    console.log( config.mail.admin )
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


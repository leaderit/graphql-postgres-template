const fp = require('fastify-plugin')
const crypto = require('crypto')

// Запрос кода подтверждения
async function sendCode(user, action, code ){
    // const { redis } = fastify
    // const { codeLife } = fastify
    // const { createToken } = fastify
    // const { user } = request

    console.log('SEND CODE: ', { user, action, code } )
    return { 
        code,
    }
}

module.exports = fp(function (fastify, opts, next) {
    fastify.decorate ( 'sendCode', sendCode )
    next()
})


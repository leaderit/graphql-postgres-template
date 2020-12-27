const crypto = require('crypto')

// Запрос кода подтверждения
async function sendCode(user, operation, code ){
    const { redis } = fastify
    const { codeLife } = fastify
    // const { createToken } = fastify
    // const { user } = request

    console.log( { operation, code } )
    return { 
        code_id,
    }
}

module.exports = function (fastify, opts, next) {
    fastify.decorate ( 'sendCode', sendCode )
    next()
}


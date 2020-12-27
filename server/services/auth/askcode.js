const crypto = require('crypto')

// Запрос кода подтверждения
async function createCode(fastify, request, reply){
    const { redis } = fastify
    const { codeLife } = fastify
    // const { createToken } = fastify
    const { user } = request

    const action = 'test'
    const code_id = crypto.randomBytes(32).toString('hex') //fastify.createToken()
    const code = '0000'
    var user_id = null
    var send_code = null;
    if ( user ) {
        user_id = user.id
        send_code = code
    } else {
        // если action=login Найти пользователя по логину и паролю
    }

    await redis.multi()
    .setex('code/'+action+'/'+code_id, codeLife, code)
    .exec()

    // send code here 
    // put code into sender queue
    fastify.sendCode( user, operation, code )
    //
    
    return { 
        code_id,
        action,
        code: send_code
    }
}

// Проверка кода подтверждения
async function checkCode( code_id, operation, code ){
    return false;
}

module.exports = function (fastify, opts, next) {
    fastify.decorate ( 'codeLife', opts.auth.codeLife || 180 )
    fastify.decorate ( 'checkCode', checkCode )

    fastify.post('/askcode', async function (request, reply) 
    {
      reply.send( await createCode(fastify, request, reply) )
    })     

    next()
}


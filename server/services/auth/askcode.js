const crypto = require('crypto')
const uuidv4 = require('uuid').v4;

// Запрос кода подтверждения
async function askCode(fastify, request, reply)
{
    const codeLengths = {
        default: 4,
        login: 6,
        unregister: 8
    }

    const { redis } = fastify
    const { codeLife } = fastify
    const { sendCode } = fastify
    // const { createToken } = fastify
    const { user } = request
    const { body } = request

    const action = body.input.action
    const code_id = uuidv4()
    var codeLen = codeLengths[ action ] || codeLengths.default
    var code = ''
    for (n=0; n<codeLen; n++) code = code + crypto.randomInt(9).toString()
    var user_id = null
    var send_code = null;

    if ( user ) {
        user_id = user.id
        send_code = code
    } else {
        // если action=login Найти пользователя по логину и паролю
        // Сверить clien и client secret
        if ( action === 'login' ) {
            // Найти пользователя
            
            send_code = code
        }
    }
    // Отправка кода
    if ( send_code ) {
        await redis.multi()
        .setex('code/'+code_id, codeLife, JSON.stringify({ action, code }) )
        .exec()
        // put code into sender queue
        if ( fastify.hasDecorator('sendCode') ) await fastify.sendCode( user, action, code )
    }
    return { 
        code_id,
        action,
        code: send_code,
    }
}

// Проверка кода подтверждения
async function checkCode( fastify, code_id, action, code )
{
    const { redis } = fastify

    const res = await redis.get( 'code/'+code_id )
    if ( res ) {
        const data = JSON.parse( res )
        if ( data.action === action & data.code === code ) return true
    }
    return false;
}

// Проверка кода подтверждения
async function cancelCode( fastify, request, reply )
{
    const { redis } = fastify
    const { user } = request
    const { body } = request

    const code_id = body.input.code_id
    const res = await redis.del( 'code/'+code_id )
    return { success: (res == 1) };
}

module.exports = function (fastify, opts, next) 
{
    fastify.decorate ( 'codeLife', opts.auth.codeLife || 180 )
    fastify.decorate ( 'checkCode', checkCode )

    fastify.post('/askcode', 
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        session_variables: { type: 'object' },
                        input: { type: 'object',
                            properties: {
                                action: { type: 'string' }
                            },
                            required:['action']
                        },
                        action: { type: 'object',
                            properties: {
                                name: { type: 'string' }
                            }
                        }
                    },
                    required:['input']
                }
            }
        },
        async function (request, reply) 
        {
            reply.send( await askCode(fastify, request, reply) )
        }
    )    
    
    fastify.post('/cancelcode', 
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        session_variables: { type: 'object' },
                        input: { type: 'object',
                            properties: {
                                code_id: { type: 'string' }
                            },
                            required:['code_id']
                        },
                        action: { type: 'object',
                            properties: {
                                name: { type: 'string' }
                            }
                        }
                    },
                    required:['input']
                }
            }
        },
        async function (request, reply) 
        {
            reply.send( await cancelCode(fastify, request, reply) )
        }
    )  

    fastify.get('/testcode', 
        async function (request, reply) 
        {
            reply.send( await fastify.testCode(fastify, request, reply) )
        }
    )  

    next()
}


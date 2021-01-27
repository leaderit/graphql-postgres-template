'use strict'

const fp = require('fastify-plugin')

/*
Извлечь и разобрать жетон доступа в запрос из заголовка
*/
function authToken( request ){
  let token = null
  let tokenType = ''
  if ( request.headers.authorization ) {
      const auth = request.headers.authorization.split(' ')
      token = auth[1].trim()
      tokenType = auth[0].trim()
  }
  return {
    token, 
    tokenType
  }
}

/*
Извлечь и разобрать код авторизации из заголовка
*/
function authCode( request ){
  const auth_code= request.headers['authorization-code'] || null
  let code = null
  let code_id = null

  if ( auth_code ) {
    const auth = auth_code.split(' ')
    code = auth[1].trim()
    code_id = auth[0].trim()
  }

  return {
    code_id,
    code 
  }
}

// BEGIN X-Hasura-Token
// Извлекаем токен из тела запроса
// Этот блок нужен для извлечения токена из тела запроса от Hasura
// При этом не нужно в наждом настраиваемом действии включать передачу
// заголовков исходного запроса от клиента. Это повышает безопастность
// и скорость.
function hasuraToken( request ){
  const { body } = request
  let token = null

  if ( body ) {
    const session_variables = body.session_variables || {}
    token = session_variables['x-hasura-token'] || null
  }
  return {
    token, 
    tokenType: 'Bearer'
  }
}


// Проверка - если пользователь зарегистрирован, загружаем в запрос его данные
async function checkUser (request, reply) {

  const fastify = this
  const { redis } = fastify
  var { token } = authToken(request)
  const code = authCode(request)
  var key = 'token/'
  var user = null

  if ( token == null ) token = hasuraToken( request ).token
  if ( token ) {
    try {
      var data = await redis.get( key+token )
      // Для расширения обьекта user = { ...JSON.parse(data), token, var2 }
      if (data) user = JSON.parse(data).user
    } catch( err ) { }
  }
  request.user = user
  request.token = token
  request.authCode = code
  return
}

module.exports = fp(function (fastify, opts, next) {
  fastify.addHook('preHandler', checkUser )
  fastify.decorateRequest('token', null ) 
  fastify.decorateRequest('user', null ) 
  fastify.decorateRequest('authCode', null ) 
  next()
})

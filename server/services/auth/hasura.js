/*
Авторизация Hasura на Redis

Работает только в паре с модулем

  users.js

в котором обьявляются необходимые переменные и обработчики

Доступ для anonymous

{"_and":[{"login":{"_eq":"X-Hasura-Login"}},{"password":{"_eq":"X-Hasura-Password"}}]}

*/

'use strict'

// Проверяем сессию и передаем жетон сессии в переменной сессии X-Hasura-Token
// Чтобы каждый раз не прописывать передачу заголовка авторизации в настройках действия
async function hasuraAuth(fastify, request, reply){
  const { user } = request
  const { token } = request
  var role = "anonymous"

  if ( fastify.backendSecret === request.backendSecret ) role = "backend"
  if ( user ) {
      return { 
          "X-Hasura-User-Id": user.id || '',
          "X-Hasura-Role": user.role.name || 'anonymous',
          "X-Hasura-Org-Id": user.org_id || '',
          "X-Hasura-Token": token || '',
      }
  }    
  // Anonymous access level for login and refresh token actions
  return {
      "X-Hasura-User-Id": "",
      "X-Hasura-Role": role,
      // Users Access
      "X-Hasura-Login": request.headers['x-hasura-login'] || '',
      "X-Hasura-Password": request.headers['x-hasura-password'] || '',
      // Applications Access
      "X-Hasura-Client": request.headers['x-hasura-client'] || '',
      "X-Hasura-Client-Secret": request.headers['x-hasura-client-secret'] || '',
  }
}

module.exports = function ( fastify, opts, next ) {

  fastify.get('/hasura', async function (request, reply) {
    // const hasura = await hasuraAuth(fastify, request, reply)
    // console.log( { hasura })
    // reply.send( hasura )
    reply.send( await hasuraAuth(fastify, request, reply) )
  })
  next()
}

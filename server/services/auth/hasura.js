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

  if ( user ) {
      return { 
          "X-Hasura-User-Id": user.id || '',
          "X-Hasura-Role": user.role.name || 'anonymous',
          "X-Hasura-Org": user.org_id || '',
          "X-Hasura-Token": token || '',
      }
  }    
  return {
      "X-Hasura-User-Id": "",
      "X-Hasura-Role": "anonymous",
      "X-Hasura-Login": request.headers['x-hasura-login'] || '',
      "X-Hasura-Password": request.headers['x-hasura-password'] || ''
  }
}

module.exports = async function ( fastify, opts ) {
  fastify.get('/hasura', async function (request, reply) {
    return await hasuraAuth(fastify, request, reply)
  })
}

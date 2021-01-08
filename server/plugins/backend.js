'use strict'
const fp = require('fastify-plugin')
const crypto = require('crypto')

// Проверка - если вызов из Backend, загружаем в запрос его данные
async function checkBackend (request, reply) {
  const fastify = this
  const { body } = request

  let backendSecret = request.headers['x-hasura-backend'] || null

  if ( backendSecret == null ) {
    if ( body ) {
      const session_variables = body.session_variables || {}
      backendSecret = session_variables['x-hasura-backend'] || null
    }    
  }
  request.backendSecret = backendSecret
  console.log('preHandler for backend=', backendSecret )
  return
}

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {

  fastify.addHook('preHandler', checkBackend )
  fastify.decorateRequest('backendSecret', null ) 
  fastify.decorate('backendSecret', crypto.randomBytes(16).toString('hex') ) 
})

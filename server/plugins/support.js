'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
  fastify.decorate('support_ok', true )

  // fastify.decorate('checkCode', async function(user, action, code) {
  //   console.log('Check code', { user: user.id, action, code })
  //   return true;
  // })
  // fastify.decorate('sendCode', async function(user, action, code) {
  //   console.log('send code', { user: user.id, action, code })
  //   return true;
  // })
  next()
})

// If you prefer async/await, use the following
//
// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('someSupport', function () {
//     return 'hugs'
//   })
// })

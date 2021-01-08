'use strict'

module.exports = function (fastify, opts, next) {
  fastify.get('/hello', function (request, reply) {
    // reply.code(404);
    reply.send({ greeting: 'Hello' })
  })

  fastify.post('/hello', function (request, reply) {
    // reply.code(404);
    reply.send({ greeting: 'Hello' })
  })

  next()
}

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//     return { root: true }
//   })
// }

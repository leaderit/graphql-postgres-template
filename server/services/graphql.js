'use strict'

module.exports = function (fastify, opts, next) {

  fastify.get('/graphql', async function (request, reply) {
    reply.send({ status: 'OK'})
  })

  fastify.post('/graphql', async function (request, reply) {
    const { hasura } = fastify

    if ( hasura ) {
      console.log( request.body )
      const { data } = await hasura('', 
        request.body,
        {
          headers: {
            'X-Hasura-Login': '', //user.username,
            'X-Hasura-Password': '', //user.password
          }
        })
      console.log( 'hasura data = ', data )
      reply.send( data )
    }
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

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

  // fastify.post('/api0/graphql', async function (request, reply) {
  //   const { hasura } = fastify

  //   if ( hasura ) {
  //     console.log( request.body )
  //     const { data } = await hasura('', 
  //       request.body,
  //       {
  //         headers: {
  //           'X-Hasura-Login': '', //user.username,
  //           'X-Hasura-Password': '', //user.password
  //         }
  //       })
  //     console.log( 'hasura data = ', data )
  //     reply.send( data )
  //   }
  // })

  // fastify.get('/api0/auth/hasura', function (request, reply) {

  //   // const { req } = this
  //   // const { token } = this

  //   console.log( 'HASURA AUTH', request.headers ) //, this )
  //   // const user = sessions.tokens[ token ] || null
  //   // if ( user ) {
  //   //     console.log( 'User found', user)
  //   //     return { 
  //   //         "X-Hasura-User-Id": user.id,
  //   //         "X-Hasura-Role": user.userRole.name,
  //   //         "X-Hasura-Org": user.org_id || '' 
  //   //     }
  //   // }
  //   //res.statusCode = 401
  //   //console.log( 'user not found', { token })
  //   reply.send({ 
  //       "X-Hasura-User-Id": "",
  //       "X-Hasura-Role": "anonymous",
  //       // "X-Hasura-Login": req.headers['x-hasura-login'] || '',
  //       // "X-Hasura-Password": req.headers['x-hasura-password'] || ''
  //   })
  //   // reply.send({ root: true })
  // })  

  next()
}

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//     return { root: true }
//   })
// }

'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {

  // Обработка освобождения событий от Redis
	fastify.decorate( 'onRedisEvent', ( channel, message, data ) => {
    console.log( 'REDIS EVENT:', {channel, message, data } )
    // const event = message.split(':')[1]
    // const key = data.split('/')
    // if ( fastify.redisKey('reservgroup') === key[0]+'/'+key[1] ) {
    //   const groupid = key[2]
    //   const landid = key[3]
    //   console.log('Free Reserv %s/%s', groupid, landid)
    //   // Известить об освобождении резерва всех подписчиков группы
    //   fastify.emitGroup('free', groupid, { 
    //     land: { 
    //       groupid, 
    //       landid 
    //     } 
    //   })
    // }
  })

  next()
})

// If you prefer async/await, use the following
//
// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('someSupport', function () {
//     return 'hugs'
//   })
// })

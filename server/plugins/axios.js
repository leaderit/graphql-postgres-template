'use strict'
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next ) {

    opts.axios = opts.axios || {}
    fastify.register(require('fastify-axios'), opts.axios )

//   // request via axios.get to https://nodejs.org/en/
//   const { data, status } = await fastify.axios.get('/en/')
//   console.log('body size: %d', data.length)
//   console.log('status: %d', status)
    next()
})
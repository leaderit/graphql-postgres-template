'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
    // CORS параметры по умолчанию для наших API
    opts.cors = opts.cors || {}
    opts.cors.origin = opts.cors.origin  || ['http://127.0.0.1:3030']
    opts.cors.methods = opts.cors.methods || ['LIST', 'GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
    opts.cors.allowedHeaders = opts.cors.allowedHeaders || ['Content-Type','Authorization','Referrer','Origin','filename']

	fastify.register(require('fastify-cors'), opts.cors )
	next()
})
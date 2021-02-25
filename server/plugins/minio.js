'use strict'
const Minio = require('minio')
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next ) {
    opts.storage = opts.storage || {}
    var s3storage = new Minio.Client( opts.storage )
    fastify.decorate('s3storage', s3storage)
    fastify.decorate('Minio', Minio)

    next()
})
'use strict'
const Storage = require('minio')
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next ) {
    opts.storage = opts.storage || {}
    var s3storage = new Storage.Client( opts.storage )
    fastify.decorate('s3storage', s3storage)
    next()
})
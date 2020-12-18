"use strict"
const path = require("path")
const fp = require("fastify-plugin")

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
    // static - параметры по умолчанию для наших API
    opts.static = opts.static || {}
	fastify.register(require("fastify-static"), opts.static )
	next()
})
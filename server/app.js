'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

// Read the .env file.
require("dotenv").config()
const config = require("./config")

module.exports = function (fastify, opts, next) {
  // Place here your custom code!
  fastify.decorate ( 'config', config )
  fastify.register(require('fastify-routes'))
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, config )
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    // maxDepth: 4,

    options: Object.assign({ prefix: '/api/'}, config )
  })

  // Make sure to call next when done
  next()
}

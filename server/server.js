"use strict"

// Require the framework
const Fastify = require("fastify")

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
  pluginTimeout: 10000
})

// app.register(require('fastify-routes'))
app.register(require("./app.js"), {} )

// Start listening.
app.listen(
  process.env.PORT || 3003, process.env.ADDRESS || "0.0.0.0" ,
  (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    // console.log(app.routes)
})
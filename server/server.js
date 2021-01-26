"use strict"

// Require the framework
const Fastify = require("fastify")
const config = require('./config')
// Instantiate Fastify with the config
const app = Fastify( config.app.fastify )
app.register(require("./app.js"), {} )

// Start listening.
app.listen(
  config.app.port,
  config.app.addr,
  // process.env.PORT || 3003, process.env.ADDRESS || "0.0.0.0" ,
  (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    // console.log(app.routes)
})
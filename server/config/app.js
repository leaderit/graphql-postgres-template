// Application confugeration
module.exports = {
  name: process.env['NAME'] ||'server-app',
  nodeenv: process.env['NODE_ENV'] || 'development',
  addr: process.env.ADDRESS || "0.0.0.0",
  port: process.env.PORT || 3000,
  // Fastify configuration
  fastify: {
    logger: true,
    pluginTimeout: 10000,
  }
}

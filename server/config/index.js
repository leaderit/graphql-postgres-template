'use strict'

const config = {
  // nodeenv: process.env['NODE_ENV'] || 'development',
  app: require('./app'),
  websocket: require('./websocket'),
  static: require('./static'),
  storage: require('./storage'),
  storages: require('./storages'),
  hasura: require('./hasura'),
  auth: require('./auth'),
  cors: require('./cors'),
  redis: require('./redis'),
  mail: require('./mail'),
  sendmail: require('./sendmail')
}

// console.log( 'addr:', addr, 'cors:', config.cors.origin )
module.exports = config
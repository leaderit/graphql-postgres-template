'use strict'

const config = {
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
module.exports = config
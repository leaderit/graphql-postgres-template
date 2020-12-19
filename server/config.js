'use strict'
const path = require('path')
const addr = process.env.ADDRESS || "0.0.0.0"
const origin = process.env.ORIGIN || 'localhost:3000'

const config = {
  nodeenv: process.env['NODE_ENV'] || 'development',
  // Fastify configuration
  logger: true,
  pluginTimeout: 10000,

  // Plugins configuration
  app: {
    name: process.env['NAME'] ||'server-app'
  },
  websocket: {
//    maxPayload: 2048,
    path: '/updates'
  },
  cors: {
    origin: origin.split(' ') || ['http://'+addr+':8080'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Referrer',
      'Origin',
      'filename',
      'credentials',
      'clientid'
    ]    
  },
  hasura: {
    baseURL: 'http://localhost:8081/graphql'
  },
  services: {

  },
  plugins: {

  },
  static: {
    root: path.join(process.env['PWD'], 'public'),
    prefix: '/',
    schemaHide: true,
    //setHeaders: ''
  },
  // Параметры авторизации
  auth: {
    tokenLife : 17, //3600
    // Если обновление жетона (токена) производится менее чем за минимальное время жизни
    // возвращается тот же жетон (токен)
    minTokenLife : 15,
    deleteSessionTimeout: 5
  },
  redis: {
    host:'redis',
    keyPrefix: 'api-template-backend/',
    // enableOfflineQueue: false
    // port: 6379,
    // password: '1234',
    // db: 0
  }
}

// console.log( 'addr:', addr, 'cors:', config.cors.origin )
module.exports = config
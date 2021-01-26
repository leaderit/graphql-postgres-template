// Путь к файловому хранилищу с правами доступа
'use strict'
const path = require('path')

module.exports = {
  // root: process.env['STORAGE'] || path.join(process.env['PWD'], 'storage'),
  // url: '/storage',
  cacheKey:'files/',
  cacheLife:60,

  // min.io
  endPoint: 'storage',
  port: 9000,
  useSSL: false,
  accessKey: process.env['STORAGE_USER'],
  secretKey: process.env['STORAGE_SECRET']
}

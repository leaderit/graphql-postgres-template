// Путь к файловому хранилищу с правами доступа
'use strict'

module.exports = {
  cacheKey:'files/',
  cacheLife:60,

  // min.io
  endPoint: 'storage',
  port: 9000,
  useSSL: false,
  accessKey: process.env['STORAGE_USER'],
  secretKey: process.env['STORAGE_SECRET']
}

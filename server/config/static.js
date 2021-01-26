// Путь к статическим файлам
'use strict'
const path = require('path')

module.exports = {
  root: path.join(process.env['PWD'], 'public'),
  prefix: '/',
  schemaHide: true,
  //setHeaders: ''
}

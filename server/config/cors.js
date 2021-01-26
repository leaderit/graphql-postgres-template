const origin = process.env.ORIGIN || 'localhost:3000'

module.exports = {
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
}

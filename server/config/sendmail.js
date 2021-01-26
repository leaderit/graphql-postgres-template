module.exports = {
  disable: true,
  host: process.env['SENDMAIL_SERVER'] || "smtp.mail.ru",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: process.env['SENDMAIL_USER'] || 'user@mail.ru',
    pass: process.env['SENDMAIL_PASSWORD'] || "bigbigpassword"
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: true
  }
}

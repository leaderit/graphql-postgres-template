module.exports = {
  disable: true,
  host: "smtp.mail.ru",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "user@mail.ru",
    pass: "bigbigpassword"
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: true
  }
}

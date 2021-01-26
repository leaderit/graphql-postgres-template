'use strict'
const fp = require('fastify-plugin')
const mailer = require("nodemailer");

module.exports = fp(function (fastify, opts, next) {
  opts.sendmail = opts.sendmail || {}
  try {
    const mail = mailer.createTransport( opts.sendmail );
    fastify.decorate('mail', mail);
    // Send an e-mail
    fastify.decorate('sendMail', function ( msg ) {
        const { mail } = fastify
        if ( opts.sendmail.disable || false ) {
          console.log('Send a mail is disabled.')
          return;
        }
        mail.sendMail( msg,
        // {
        //   from,     // адрес отправителя: '"Valeriy Grazhdankin" <ias-projects@mail.ru>'
        //   to,       // Адреса получателей: "ias-projects@mail.ru, admin@centerstruve.com"
        //   subject,  // Строка темы
        //   text,     // Plain text body
        //   html      // Html body
        // } 
        function (err, info, response){
          if (err) console.log('sendmail', err)
          else console.log("sendmail message sent: %s", info.messageId);
        });  
    })
          
		next();
	} catch (error) {
		next(error);
	}    
})

'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const plugin = require('../../plugins/sendmail')

test('Send Mail works standalone', (t) => {
  t.plan(3)
  const fastify = Fastify()
  fastify.register(plugin)

  fastify.ready((err) => {
    t.error(err)
    t.equal( fastify.mail === undefined , false)
    t.equal( fastify.sendMail === undefined , false)
  })
})

// If you prefer async/await, use the following
//
// test('support works standalone', async (t) => {
//   const fastify = Fastify()
//   fastify.register(Support)
//
//   await fastify.ready()
//   t.equal(fastify.someSupport(), 'hugs')
// })

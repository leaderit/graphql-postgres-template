'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const Hasura = require('../../plugins/hasura')

test('Hasura works standalone', (t) => {
  t.plan(2)
  const fastify = Fastify()
  fastify.register(Hasura)

  fastify.ready((err) => {
    t.error(err)
    t.equal( fastify.hasura === undefined , false)
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

'use strict'
const fs = require('fs')
const pump = require('pump')
// const mkdirp = require('mkdirp')


// Возвращает профиль пользователя
async function fileurl(fastify, request, reply){
  const { user } = request

  if ( user ) {
      return { 
        file_id: null,
        url: null
      }
  }
  return { 
    file_id: null,
    url: null
  }
}

// Возвращает профиль пользователя
async function fileupload(fastify, request, reply){
  const { user } = request

  if ( user ) {
      return { 
        file_id: null,
        url: null
      }
  }
  return { 
    file_id: null,
    url: null
  }
}

module.exports = function (fastify, opts, next) {
  const { hasura } = fastify

  // fastify.decorate ( 'tokenLife', opts.auth.tokenLife || 0 )
  // fastify.decorate ( 'minTokenLife', opts.auth.minTokenLife * 1000 || 10000 )
  // fastify.decorate ( 'deleteSessionTimeout', opts.auth.deleteSessionTimeout || 5 )

  fastify.post('/fileurl', async function (request, reply) 
  {
    reply.send( await fileurl(fastify, request, reply) )
  })

  fastify.post('/upload', async function (request, reply) 
  {
    reply.send( await fileupload(fastify, request, reply) )
  })

  fastify.post('/uploaded', async function (request, reply) 
  {
    console.log( request.headers, request.body )
    reply.send( {
      upload: 'ok'
    } )
  })

  fastify.get('/uploaded', async function (request, reply) 
  {
    console.log( request.headers, request.body )
    reply.send( {
      upload: 'GET OK'
    } )
  })

  next()
}

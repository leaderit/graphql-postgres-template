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

async function onFile(part) {
  console.log( 'UPLOADED=', part )
  // await pump(part.file, fs.createWriteStream(part.filename))
}

module.exports = function (fastify, opts, next) {
  const { hasura } = fastify

  fastify.register(require('fastify-multipart'), { attachFieldsToBody: true, onFile })

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
    console.log( 'Uploaded=', { headers: request.headers, body: request.body } )
    const { body } = request
    if ( body ) {
      const content_type = body['file.content_type'].value
      const name = body['file.name'].value
      const path = body['file.path'].value
      const size = body['file.size'].value
      const file_id = body['file_id'].value
      console.log( content_type, name, path, size, file_id )
    }
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

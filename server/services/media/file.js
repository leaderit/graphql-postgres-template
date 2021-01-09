'use strict'
const fs = require('fs')
const pump = require('pump')
const mkdirp = require('mkdirp')

var storageRoot = '/storage'


// Возвращает профиль пользователя
async function fileAccess(fastify, request, reply){
  const { user } = request
  let filePath = '/'
  let access = false
  let content_type = ''

  const group = request.params.group
  const file = request.params.file

  if ( user ) {
    if ( group ==='user' ) filePath = 'users/'+user.id+'/'

    console.log( 'ACCESS FILE:', { group, file, user }, request.headers, request.body )
    // ПОЛУЧИТЬ ДАННЫЕ ФАЙЛА ИЗ БД!!! И ПРОВЕРИТЬ ПРАВА!!!
    content_type = 'image/jpeg'
    access = true
    // 
    
    if ( access ) {
      reply.headers({
        'X-Accel-Redirect':'/files/'+filePath+file,
        'Content-Type': content_type
      })
      return ''
    }
  }
  reply.code(404)
  return '' 
}

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

// Обработка загруженного пользователем файла
async function fileUploaded(fastify, request, reply){
  const { user } = request

  console.log( 'Uploaded=', { headers: request.headers, body: request.body } )
  const { body } = request

  if ( body ) {
    const content_type = body['file.content_type'].value
    const name = body['file.name'].value
    const path = body['file.path'].value
    const size = body['file.size'].value
    const file_id = body['file_id'].value
    console.log( content_type, name, path, size, file_id )

    if ( user ) {
        // Обновить БД с файлом и переместить файл
        const fileDir = storageRoot+'/users/'+user.id
        const filePath = fileDir +'/'+file_id
        mkdirp.sync(fileDir)
        // Storage URL добавить в конфиг!!!
        const url = '/file/'+file_id 

        fs.rename( path, filePath, ( err )=>{
          if ( err ) console.log( { err } )
          else console.log( 'moved ', path )
        })
        // ТУТ НАДО ОБНОВИТЬ files в БД!!!

        //
        return { 
          // user_id: user.id,
          uploaded: true,
          file_id: file_id,
          type: content_type,
          size,
          url
        }
    }

    fs.rm( path, { force: true, maxRetries: 3, retryDelay: 5000}, ( err )=>{
      if ( err ) console.log( { err } )
      else console.log( 'deleted ', path )
    })
  }

  return { 
    uploaded: false,
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
  const { root } = opts.storage // Storage root directory
  storageRoot = root

  fastify.register(require('fastify-multipart'), { attachFieldsToBody: true, onFile })


  // Вызывается из PROXY для проверки прав доступа к файлу
  fastify.get('/access/:group/:file', async function (request, reply) 
  {
    reply.send( await fileAccess(fastify, request, reply) )
  })

  fastify.post('/fileurl', async function (request, reply) 
  {
    reply.send( await fileurl(fastify, request, reply) )
  })

  fastify.post('/upload', async function (request, reply) 
  {
    reply.send( await fileupload(fastify, request, reply) )
  })

  // Вызывается из PROXY когда файл загружен
  fastify.post('/uploaded', async function (request, reply) 
  {
    reply.send( await fileUploaded(fastify, request, reply) )
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

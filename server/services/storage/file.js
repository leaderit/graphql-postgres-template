'use strict'
const fs = require('fs')
// const pump = require('pump')
const mkdirp = require('mkdirp')
var storageRoot = '/storage'
var storageUrl ='/storage'
const files = require('../../gql/files.gql')  // Стандартные запросы к файлам

// Получить данные запрошенного файла из БД
async function getFile( fastify, request, file_id )
{
    const { hasura } = fastify
    // Получаем запись о файле из БД
    const { data } = await hasura('', {
      query:
      `
      query file_by_id($id: uuid! = "") {
        files_by_pk(id: $id) {
          created_at
          descr
          filename
          group
          id
          name
          org_id
          owner_id
          public
          size
          type
          updated_at
          uploaded
        }
      }
      `,
      variables: {
          id: file_id,
      }
  }, {
      headers: {
        "Authorization": request.headers.authorization,
      }
  })

  var file = null
  if ( data.data ) file = data.data.files_by_pk
  return file
}

// Обновить данные загруженного файла в БД
async function updateFile( fastify, request, file )
{
    const { hasura } = fastify
    console.log( { file } )
    // Получаем запись о файле из БД
    const { data } = await hasura('', {
      query:
      `
      mutation UploadUpdate(
        $id: uuid! = "", 
        $filename: String = "", 
        $size: Int = 0, 
        $uploaded: Boolean = false,
        $type: String = "",
        $group: String = ""
      ) {
        update_files_by_pk(
          pk_columns: {id: $id}, 
          _set: { filename: $filename, size: $size, type: $type, uploaded: $uploaded, group: $group }) {
          id
          size
          type
          uploaded
          filename
          group
        }
      }
      `,
      variables: {
          id: file.id,
          filename: file.name,
          uploaded: file.uploaded,
          type: file.content_type,
          size: file.size,
          group: file.group
      }
  }, {
      headers: {
        "Authorization": request.headers.authorization,
      }
  })

  var file = null
  if ( data.data ) file = data.data.update_files_by_pk
  return file    
}

// Проверка прав доступа к файлу хранилища
async function fileAccess(fastify, request, reply){
  const { user } = request
  let filePath = null
  let url = null
  let access = false
  const { group } = request.params
  const { file_id } = request.params

  if ( user ) {
    if ( group ==='user' ) filePath = 'users/'+user.id+'/'
    if ( group ==='org' && user.org_id ) filePath = 'orgs/'+user.org_id+'/'
    if ( group ==='public' ) filePath = 'public/'

    const file = await getFile( fastify, request, file_id )
    if ( file && filePath ) {
      // При неободимости добавить сюда проверку дополнительных прав
      // На основе данных из БД и сессии
      access = true
      url = '/files/'+filePath+file_id
    }
    if ( access ) {
      reply.headers({
        'X-Accel-Redirect': url, 
        'Content-Type': file.type
      })
      return ''
    }
  }
  reply.code(404)
  return '' 
}

// Обработка загруженного пользователем файла
async function fileUploaded(fastify, request, reply){
  const { user } = request
  const { body } = request
  let filePath = null

  if ( body ) {
    const file = {
      id: body['file_id'].value,
      group: body['file_group'].value,
      content_type: body['file.content_type'].value,
      name: body['file.name'].value,
      path: body['file.path'].value,
      size: body['file.size'].value,
      uploaded: true
    }

    if ( user ) {
      if ( file.group ==='user' ) filePath = 'users/'+user.id+'/'
      if ( file.group ==='org' && user.org_id ) filePath = 'orgs/'+user.org_id+'/'
      if ( file.group ==='public' ) filePath = 'public/'

      // Если выбрана допустимая группа для загрузки файла
      if ( filePath ) {
        // Обновить БД с файлом и переместить файл
        file.dir = storageRoot + '/' + filePath
        file.newPath = file.dir + file.id
        mkdirp.sync(file.dir)
        file.url = storageUrl + '/' + file.group + '/' + file.id 
        fs.rename( file.path, file.newPath, ( err ) => {
          if ( err ) console.log( { err } )
        })
        const file_res = await updateFile( fastify, request, file )
        return { 
          uploaded: file_res.uploaded, 
          file_id: file_res.id,
          type: file_res.type,
          size: file_res.size,
          url: file.url,
          group: file_res.group
        }
      }
    }

    fs.rm( file.path, { force: true, maxRetries: 3, retryDelay: 5000}, ( err )=>{
      if ( err ) console.log( { err } )
      else console.log( 'deleted ', file.path )
    })
  }

  return { 
    uploaded: false,
    file_id: null,
    url: null
  }
}

module.exports = function (fastify, opts, next) {
  const { hasura } = fastify
  const { root } = opts.storage // Storage root directory
  const { url } = opts.storage // Storage url
  storageRoot = root
  storageUrl = url

  fastify.register(require('fastify-multipart'), { attachFieldsToBody: true })

  // Вызывается из PROXY для проверки прав доступа к файлу
  fastify.get('/access/:group/:file_id', async function (request, reply) 
  {
    reply.send( await fileAccess(fastify, request, reply) )
  })

  // Вызывается из PROXY когда файл загружен 
  fastify.post('/uploaded', async function (request, reply) 
  {
    reply.send( await fileUploaded(fastify, request, reply) )
  })

  next()
}

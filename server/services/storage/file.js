'use strict'
const fs = require('fs')
const mkdirp = require('mkdirp')
const files = require('../../gql/files.gql')  // Стандартные запросы к файлам

// Хранилища файлов
let storages = null
let cfg = null;

// Получаем путь для перемещения файла и url для его получения через PROXY 
function getFileStorage( file, user ){
  const name = file.group
  const storage = storages[ name ] || null
  let filePath = null
  let fileDir = null
  let fileUrl = null

  if ( storage ) {
    let path = storage.template
    path = path.replace('${user_id}', user.id )
    path = path.replace('${org_id}', user.org_id || null)
    // Последним обрабатываем file_id
    fileDir = storage.path + path.replace('/${file_id}', '' )
    path = path.replace('${file_id}', file.id )
    filePath = storage.path + path;
    fileUrl = storage.url + path;
  }

  return {
    type: file.type,
    fileDir,
    filePath,
    fileUrl
  }
}

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
      ) {
        update_files_by_pk(
          pk_columns: {id: $id}, 
          _set: { filename: $filename, size: $size, type: $type, uploaded: $uploaded}) {
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
          size: file.size
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
  const { redis } = fastify
  const { user } = request
  let filePath = null
  let url = null
  let access = false
  let storage = null
  let file = null
  const { file_id } = request.params
  const fileKey = cfg.cacheKey + file_id

  if ( user ) {
    // Кеширование url для file storage
    // Получить из кеша по file_id
    const storage_data = await redis.get( fileKey )
    if ( storage_data ) storage = JSON.parse( storage_data )
    if ( storage === null ) {
      // console.log('ПУСТО - БЕРЕМ ИЗ БД')
      // Если пусто - запросить из БД
      file = await getFile( fastify, request, file_id )
      if ( file ) {
        storage = getFileStorage( file, user )
        // сохранить storage в кеш
        await redis.setex(fileKey, cfg.cacheLife, JSON.stringify( storage ))
      }
    } else {
      // console.log("ИЗ КЕША - ПРОДЛЯЕМ ЖИЗНЬ")
      redis.expire(fileKey, cfg.cacheLife)      
    }
    // Тут на выходе правильный storage из БД или из кеша
    if ( storage && storage.fileUrl ) {
      // При неободимости добавить сюда проверку дополнительных прав
      // На основе данных из БД и сессии
      access = true
      url = storage.fileUrl
    }
    if ( access ) {
      reply.headers({
        'X-Accel-Redirect': url, 
        'Content-Type': storage.type
      })
      return ''
    }
  }
  reply.code(404)
  return '' 
}

// Проверка прав доступа на загрузку файла
async function fileUploadAccess(fastify, request, reply){
  const { redis } = fastify
  const { user } = request
  let filePath = null
  let url = null
  let access = false
  let storage = null
  let file = null
  const file_id = request.headers['x-file-id']
  const fileKey = cfg.cacheKey + file_id

  if ( user ) {
    // Запросим файл из БД
    if ( file_id ) {
      file = await getFile( fastify, request, file_id )
      if ( file ) {
        storage = getFileStorage( file, user )
        // сохранить storage в кеш
        await redis.setex(fileKey, cfg.cacheLife, JSON.stringify( storage ))
      }
    }
    // console.log( { file, storage })
    // // Тут на выходе правильный storage из БД или из кеша
    if ( storage && storage.fileUrl ) {
      // При неободимости добавить сюда проверку дополнительных прав
      // На основе данных из БД и сессии
      access = true
      url = storage.fileUrl
    }
    if ( access ) {
      return ''
    } else reply.code( 403 )
  } else reply.code( 401 )
  return '' 
}

// Возвращает значения поля формы из тела запроса
function getFieldValue( body, name, def = null ){
  return ( body[name] || { value: def }).value
}

// Обработка загруженного пользователем файла
async function fileUploaded(fastify, request, reply){
  const { redis } = fastify
  const { user } = request
  const { body } = request
  // const file_id = request.headers['x-file-id']

  if ( body ) {
    const file = {
      id: request.headers['x-file-id'], //getFieldValue( body, 'file_id'),
      content_type: getFieldValue( body, 'file.content_type'), 
      name: getFieldValue( body, 'file.name'),
      path: getFieldValue( body, 'file.path'),
      size: getFieldValue( body, 'file.size'),
      uploaded: true
    }

    if ( user && file.path ) {
      const file_data = await getFile( fastify, request, file.id )
      const storage = getFileStorage( file_data, user )
      // Если выбрана допустимая группа для загрузки файла
      if ( storage && storage.filePath) {
        // Обновить БД с файлом и переместить файл
        mkdirp.sync( storage.fileDir )
        file.url = cfg.url + '/' + file.id 
        fs.rename( file.path, storage.filePath, ( err ) => {
          if ( err ) console.log( { err } )
        })
        const file_res = await updateFile( fastify, request, file )
        storage.type = file_res.type
        await redis.setex('files/'+file_res.id, cfg.cacheLife, JSON.stringify( storage ))
        return { 
          uploaded: file_res.uploaded, 
          file_id: file_res.id,
          type: file_res.type,
          size: file_res.size,
          url: file.url,
          group: file_res.group
        }
      } else return {
        uploaded: false,
        error: 'wrong file storage'        
      }
    }
    if (file.path) {
      fs.rm( file.path, { force: true, maxRetries: 3, retryDelay: 5000}, ( err )=>{
        if ( err ) console.log( { err } )
        else console.log( 'Uploads deleted ', file.path )
      })
    } else return {
      uploaded: false,
      error: 'wrong file'      
    }
  }

  return { 
    uploaded: false,
    error: 'wrong request'
  }
}

module.exports = function (fastify, opts, next) {
  storages = opts.storages || null
  cfg = opts.storage

  fastify.register(require('fastify-multipart'), { attachFieldsToBody: true })

  // Вызывается из PROXY для проверки прав доступа к файлу
  fastify.get('/access/:file_id', async function (request, reply) 
  {
    reply.send( await fileAccess(fastify, request, reply) )
  })

  // Вызывается из PROXY для проверки прав доступа к на загрузку файла
  fastify.get('/access-up/', async function (request, reply) 
  {
    reply.send( await fileUploadAccess(fastify, request, reply) )
  })

  // Вызывается из PROXY когда файл загружен 
  fastify.post('/uploaded', async function (request, reply) 
  {
    const result = await fileUploaded(fastify, request, reply)
    if ( !result.uploaded ) reply.code(422)
    reply.send( result )
    // console.log('.\n.\n.\n.\n.\n.\n.\n')
  })

  next()
}

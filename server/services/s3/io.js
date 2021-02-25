'use strict'
const fs = require('fs')
// const pump = require('pump')

// var file = '/storage/tmp/vsms-ht-logo.mp4'

// async function start(fastify, request, reply) {
//   const storage = fastify.s3storage
//     // Make a bucket called europetrip.
//     try {
//         await storage.makeBucket('users1', 'Orenburg');
//     } catch (err) {
//         // console.log(err)
//     }

//     var metaData = {
//         // 'Content-Type': 'video/mov',
//         'Content-Type': 'video/mp4',
//         // 'Content-Type': 'application/octet-stream',
//         'X-Amz-Meta-Testing': 1234,
//         'example': 5678
//     }
//     // Using fPutObject API upload your file to the bucket europetrip.
//     const etag = await storage.fPutObject('users1', 'video/81fc512a-4236-11eb-96d1-975577b0463c', file, metaData)
//     // , function(err, etag) {
//     // // storage.fPutObject('users', 'config.js', file, metaData, function(err, etag) {
//     // if (err) return console.log(err)
//     // console.log('File uploaded successfully. etag=', etag)
//     // });
//     console.log('File uploaded successfully. etag=', etag)

// }

async function storage_newfile(fastify, args) {
  const storage = fastify.s3storage
    // Make a bucket called europetrip.
    // try {
    //     await storage.makeBucket(args.storage, 'Orenburg');
    // } catch (err) {
    //     // console.log(err)
    // }

    // expires in a day.
    const path = await storage.presignedPutObject(args.storage, args.path+args.name, 24*60*60)
    const url = path.replace('http://storage:9000', 'http://localhost:8088/s3')
    return {
      url
    }
}

async function storage_fileurl(fastify, args) {
  const storage = fastify.s3storage
  const expires = args.expires || 1 * 60 * 60 // do from config

  const path = await storage.presignedGetObject(args.storage, args.path+args.name, expires )
  const url = path.replace('http://storage:9000', 'http://localhost:8088/s3')
  return {
    url
  }
}


async function storage_new(fastify, args) {
  const storage = fastify.s3storage
  let success = false
  let error = null

  try {
    await storage.makeBucket(args.storage, args.region )
    success = true
  } catch (err) {
    error = err.name +':'+err.message
  }
  return {
    success,
    error
  }
}

async function storage_rm(fastify, args) {
  const storage = fastify.s3storage
  let success = false
  let error = null
  try {
    await storage.removeBucket(args.storage)
    success = true
  } catch (err) {
    error = err.name +':'+err.message
  }
  return {
    success,
    error
  }
}

async function listBuckets( fastify )
{
  const storage = fastify.s3storage
  var list = []
    try {
        list = await storage.listBuckets();
        // return list
    } catch (err) {
        console.log(err)
    }
    return list
}

async function listFiles( fastify, args )
{
  const storage = fastify.s3storage
  var list = []
  var i = 0
  console.log('LIST FILES')
  var promise = new Promise(function(resolve, reject) 
  {
    var stream = storage.extensions.listObjectsV2WithMetadata( args.storage, args.path, false );
    var data = ''
    stream.on('data', function(obj){
      if ( obj.size > 0 ) {
        // FILE
        obj.is_directory = false
      } else {
        // DIR
        obj.is_directory = true
        obj.name = obj.prefix
      }
      console.log( i, obj )
      i = i+1
      list.push( { 
        name: obj.name,
        size: obj.size,
        is_directory: obj.is_directory
      } )
    })
    stream.on('end', () => resolve(list))
    stream.on('error', reject )
  })
  return promise
}

async function storage_rmfile(fastify, args) {
  const storage = fastify.s3storage
  let success = false
  let error = null
  try {
    await storage.removeObject(args.storage, args.path+args.name)
    success = true
  } catch (err) {
    error = err.name +':'+err.message
  }
  return {
    success,
    error
  }
}

async function storage_cpfile(fastify, args) {
  const storage = fastify.s3storage
  const { Minio } = fastify
  let success = false
  let error = null
  var conds = new Minio.CopyConditions()

  try {
    await storage.copyObject(args.to_storage, args.to_path+args.to_name, '/'+args.storage+'/'+args.path+args.name, conds )
    success = true
  } catch (err) {
    error = err.name +':'+err.message
  }
  return {
    success,
    error
  }
}

async function storage_mvfile(fastify, args) {
  const storage = fastify.s3storage
  const { Minio } = fastify
  let success = false
  let error = null
  var conds = new Minio.CopyConditions()
  
  try {
    await storage.copyObject(args.to_storage, args.to_path+args.to_name, '/'+args.storage+'/'+args.path+args.name, conds )
    await storage.removeObject(args.storage, args.path+args.name)
    success = true
  } catch (err) {
    error = err.name +':'+err.message
  }
  return {
    success,
    error
  }
}

async function s3io( fastify, request, reply ){
  // console.log( request.headers )
  // console.log( request.body )
  const session_vars = request.body.session_variables || {}
  const args = request.body.input || {}
  const action = request.body.action.name
  // const action = args.action
  // console.log( action )

  if ( action === 'storages') return await listBuckets(fastify)
  if ( action === 'storage_files') return await listFiles(fastify, args )
  if ( action === 'storage_newfile') return await storage_newfile(fastify, args )
  if ( action === 'storage_fileurl') return await storage_fileurl(fastify, args )
  if ( action === 'storage_new') return await storage_new(fastify, args )
  if ( action === 'storage_rm') return await storage_rm(fastify, args )
  if ( action === 'storage_rmfile') return await storage_rmfile(fastify, args )
  if ( action === 'storage_mvfile') return await storage_mvfile(fastify, args )
  if ( action === 'storage_cpfile') return await storage_cpfile(fastify, args )

  return []
}

async function s3access( fastify, request, reply ){
  const { redis } = fastify
  const { user } = request
  let filePath = null
  let url = null
  let access = true
  let storage = null
  let file = null
  let orig = request.headers['X-Original-URI']

  url = orig.replace('/s3/', 's3internal')
  console.log( { orig, url, headers: request.headers, body: request.body } )

  if ( access ) {
    reply.headers({
      'X-Accel-Redirect': url, 
      'Content-Type': storage.type
    })
    return ''
  }
  reply.code(404)
  return '' 
}

module.exports = function (fastify, opts, next) {
  // start.bind( fastify )

  fastify.get('/example', async function (request, reply) {
    await start( fastify, request, reply )
    reply.send('this is an example')
  })

  fastify.post('/io', async function (request, reply) 
  {
    reply.send( await s3io(fastify, request, reply) )
  })

  // Вызывается из PROXY для проверки прав доступа к файлу    
  fastify.get('/access', async function (request, reply) 
  {
    reply.send( await s3access(fastify, request, reply) )
  })

  // // Вызывается из PROXY для проверки прав доступа к файлу
  // fastify.get('/access/:file_id', async function (request, reply) 
  // {
  //   reply.send( await fileAccess(fastify, request, reply) )
  // })
    
  next()
}

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/example', async function (request, reply) {
//     return 'this is an example'
//   })
// }

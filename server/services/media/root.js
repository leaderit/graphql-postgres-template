'use strict'
const fs = require('fs')
const pump = require('pump')
// const mkdirp = require('mkdirp')

module.exports = function (fastify, opts, next) {
  // fastify.get('/example', function (request, reply) {
  //   reply.send('this is an example')
  // })

//   fastify.addContentTypeParser([
//     'image/octet-stream',
//     'image/png',
//     'image/jpeg',
//     'application/x-binary'
//     ], 
//     { parseAs: 'buffer' },
//     function (request, payload, done) {
//      console.log('parser:', payload.length, { payload });
//     done(null, payload)
// return
//     var data = ''
//     payload.on('data', chunk => { data += chunk })
//     payload.on('end', () => {
//       done(null, data)
//     })
//   })
  
//   fastify.get('/:id', function (request, reply) {
//     console.log('Header:', request.headers)
//     console.log('Body:', request.body)
//     console.log('id=', request.params.id)
//     reply.send({ 
//       test:'this is an example',
//       version: '1.0'
//     })
//   })

//   // POST
//   fastify.post('/:id', function (request, reply) 
//   {
//     console.log('Header:', request.headers)
//     // console.log('Body:', request.body)
//     console.log('id=', request.params.id)

//     let mediaType = request.params.type || "unknown";
//     let contentLength = request.headers['content-length'];
//     let contentType = request.headers['content-type'];     
//     let fileName = request.headers['filename'] || 'unknown';
//     let ext = fileName.substr(fileName.lastIndexOf('.') + 1);
//     let mediasize = 0
//     const filePath = 'uploaded.ext' //mediaFilePath(media.storage, media.owner, media.company, media.filename, media.id, mediaType )

//     if (contentType == 'image/octet-stream') {
//       console.log('image/octet-stream')
//     } else {

//     }

//     fs.writeFile("test.txt", request.body,  "binary", function(err) {
//       if(err) {
//           console.log(err);
//       } else {
//           console.log("The file was saved!");
//       }
//   });

//     const stream = fs.createWriteStream( filePath )

//     ////
//     reply.send(
//       {
//         success: true
//       });
//     //
//     return;

//     stream.on('finish', function(){
//         //  media.loaded = true
//         //  media.save()
//          reply.send(
//          {
//            success: true
//          });
//     })

//     stream.on('error', function(err) {
//          reply.send(err);
//     });

//     request.body.pipe(stream);

//     request.body.on('data', chunk => { 
//          mediasize +=chunk.length
//          console.log(chunk.length, "/", mediasize)
//     })
    
//     request.body.on('end', () => {
//          console.log("end /", mediasize)
//     })

//   }) 

  next()
}

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/example', async function (request, reply) {
//     return 'this is an example'
//   })
// }

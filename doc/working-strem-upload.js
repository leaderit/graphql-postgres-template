const fs = require('fs')
const mkdirp = require('mkdirp')
//const tmp = require('tmp')
var mediaStorage = "data"
var Media = require('../schema/media')

// возвращает путь к медиа файлу
var mediaFilePath =  function ( storage, owner, company, filename, mediaid, mediatype, fullpath = true ){
     // Тут выбирать хранилище в зависимости от входных параметров
     let storagePath = mediaStorage
     let subdir = ""

     if (mediatype == "avatar") subdir="user/"+owner+"/"+mediatype+"/"
     else subdir="company/" + ( company || "all" ) +"/"+mediatype+"/"
     mkdirp.sync(storagePath+subdir)
     if (fullpath) return storagePath+subdir+filename
     return subdir+filename
}

 
// Загрузка медиа файла обработчик
var putMediaUpload =  async function(request, reply){

// //     let filename = found[1];
     let mediaType = request.params.type || "unknown";
     let contentLength = request.headers['content-length'];
     let contentType = request.headers['content-type'];     
     let fileName = request.headers['filename'] || 'unknown';
     let ext = fileName.substr(fileName.lastIndexOf('.') + 1);

     const Media = request.db.models.Media
     const login = request.login
     // request.body = содержимое файла при  PUT
     let media = new Media()
     media.owner = login.user.id
     media.company = login.user.company || null
     media.company = null

     media.name = fileName
     media.filename = media.id + '.' +ext
     media.type = mediaType
     media.mimetype = contentType
     media.loaded = false
     media.size = 0
     media.storage="local"
     //await media.save()
     const fs = require('fs')
     const filePath = mediaFilePath(media.storage, media.owner, media.company, media.filename, media.id, mediaType )

     if (contentType == 'image/octet-stream') console.log('image/octet-stream')
     const stream = fs.createWriteStream( filePath )

     stream.on('finish', function(){
          
          media.loaded = true
          media.save()
          reply.send(media);
     })

     stream.on('error', function(err) {
          reply.send(err);
     });

     request.body.pipe(stream);

     request.body.on('data', chunk => { 
          media.size +=chunk.length
          console.log(chunk.length, "/", media.size)
     })
     request.body.on('end', () => {
          console.log("end /", media.size)
     })
}

 // Загрузка медиа файла обработчик
var mediaUpload =  async function(request, reply){

     let contentType = request.headers['content-type']
     let contentLength = request.headers['content-length']
     const Media = request.db.models.Media
     const login = request.login
     const storage = request.mediaStorage || ""

     console.log(storage, contentType, contentLength, request.headers)
     // request.body = содержимое файла при  PUT
//      console.log(request)
//      if (request.body.file) {
// //          console.log(request.body.file)
//           let file = request.body.file;
//           file.mv('../filename.jpg')
//      }

     if (!request.body.file || Object.keys(request.body.file).length === 0) {
          return reply.status(400).send('No files were uploaded.');
     }
     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
     let file = request.body.file;    
     console.log( file )

     //await request.db.models.Media.deleteMany({}).exec();
     let media = new Media()
     media.owner = login.user.id
     //media.company = login.user.company
     media.company = null

     var fileName = file.name
     var ext = fileName.substr(fileName.lastIndexOf('.') + 1);

     media.name = file.name
     media.filename = media.id + '.' +ext
     media.type = "avatar"
     media.mimetype = file.mimetype
     media.loaded = true
     media.size = file.size
     await media.save()

     // Use the mv() method to place the file somewhere on your server
     file.mv(storage + media.filename , function(err) {
          if (err) return reply.status(500).send(err);        
          reply.send(media);
     })
}

// Отправка медиа файла клиенту
var mediaFile =  async function(request, reply){
     let id = request.params.id || null;
     const Media = request.db.models.Media
     const login = request.login
     const storage = request.mediaStorage || ""

     console.log(id)
     let media = null;
     try {
          media = await Media.findById(id).exec();
     } catch(e) {}

     if (!media) {
          reply.callNotFound();
     } else {
          let fileName =  storage + media.filename	
          const fs = require('fs')
          const stream = fs.createReadStream(fileName) //, 'utf8')

          stream.on('readable', function(){
               var data = stream.read();
               if(data != null) console.log(data.length);
           });
            
           stream.on('end', function(){
               console.log("THE END");
           });
            
           stream.on('error', function(err){
               if(err.code == 'ENOENT'){
                   console.log("Файл не найден");
               }else{
                   console.error(err);
               }
           });

          reply
               .header('Content-Disposition', 'attachment; filename="'+media.filename+'"')
               .type(media.mimetype)
               .send(stream)          	
     }
}

// Отправка медиа файла клиенту
var mediaFileStatic =  async function(request, reply){
     let id = request.params.id || null;
     const Media = request.db.models.Media
//     const login = request.login
//     console.log(id)
     let media = null;
     try { media = await Media.findById(id).exec(); } catch(e) {}
     if (!media) reply.callNotFound();
     else {
          const filePath = mediaFilePath(media.storage, media.owner, media.company, media.filename, media.id, media.type, false )
//          console.log(filePath)
          reply.sendFile(filePath)
     }
}


// Удалить медиа файл файл клиенту
var deleteMediaFile =  function(doc){
     const filePath = mediaFilePath(doc.storage, doc.owner, doc.company, doc.filename, doc._id, doc.type )
//     console.log('%s has been removed in controller', doc._id, doc, 'file=', filePath );
     fs.unlinkSync(filePath)
}


// принимаем сожержимое для конкретных типов файлов
var contentTypeParser = function (request, done) {
     done(null, request)
}

var contentTypes = ['image/jpeg', 'image/png', 'video/quicktime', 'image/octet-stream']

Media.post('remove', deleteMediaFile )

var setMediaStorage = function ( storage ){
     mediaStorage = storage
}

module.exports = {
     contentTypes: contentTypes,
     contentTypeParser : contentTypeParser,
     mediaFile: mediaFile,
     mediaUpload: mediaUpload,
     putMediaUpload: putMediaUpload,
     deleteMediaFile: deleteMediaFile,
     mediaStorage: mediaStorage,
     setMediaStorage: setMediaStorage,
     mediaFileStatic: mediaFileStatic
}

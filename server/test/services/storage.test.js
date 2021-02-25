'use strict'

const helper = require('../helper')
const { test } = require('tap')
// const { build } = helper 
// const { config } = require('../helper')
const auth = require('../../gql/auth.gql')
const storage = require('../../gql/storage.gql')
// const backend = helper.backend
const graphql = helper.graphql
const axios = helper.axios
const fs = require('fs');

var stream, url, file, size

const tmpStorage = 'storage-9e74ce44-1ae6-11eb-ae92-8f6f1e8276cc'
const region = 'my_region'

const file_video = {
  storage: tmpStorage,
  path:'video/',
  name:'test-video.mp4'
}

const file_img = {
  storage: tmpStorage,
  path:'img/',
  name:'test-image.jpg'
}

const main = async () => {

await test('TEST: Storage', async (t) => {
  const user = {
    client_id:'ios-v1',
    client_secret:'supersecret',
    scope:'the app and the user scope',
    username:'admin',
    password:'password'
  }

  var data
  var rc
  var access_token

  // t.plan( 9 )
  t.setTimeout(10000000)

  rc = await graphql(
  {
    query: auth.Login,
    variables: user
  })
  data = rc.data
  t.type(data, 'object')
  t.type(data.login.access_token, 'string') 
  access_token = data.login.access_token

  rc = await graphql(
    {
        query: storage.storages
    },
    {
        'Authorization':'Beared ' + access_token
    }
  )
  t.type(rc.data, 'object', 'Error storages answer')
  t.type(rc.data.storages, 'object', 'error storages list')

  /// Create New Storage
  rc = await graphql(
    {
        query: storage.newStorage,
        variables: {
          storage: tmpStorage,
          region
        }
    },
    {
        'Authorization':'Beared ' + access_token
    }
  )
  t.type(rc.data, 'object', 'Error storages answer')
  t.type(rc.data.storage_new, 'object', 'error storages list')
  t.equal(rc.data.storage_new.success, true, 'New Storage Error')

/// UPLOAD IMAGE  
  rc = await graphql(
    // query
    {
        query: storage.newFile,
        variables: file_img
    },
    {
        'Authorization':'Beared ' + access_token
    }
  )
  t.type(rc.data, 'object', 'Error new file answer')
  t.type(rc.data.storage_newfile.url, 'string')
  url = rc.data.storage_newfile.url.replace( /^http:\/\/.*\/s3\//g, 'http://proxy/s3/')

  file = 'test/test-picture.jpg'
  stream = fs.createReadStream(file)
  stream.on('error', console.log)

  rc = await axios({
      method: 'put',
      url,
      data: stream,
      headers: {
        'Content-Type': 'image/jpeg',
        'Authorization':'Beared ' + access_token
      }
  }).catch(console.log)    
  t.equal(rc.status, 200, 'Upload Error')

/// UPLOAD VIDEO
rc = await graphql(
  // query
  {
      query: storage.newFile,
      variables: file_video
  },
  {
      'Authorization':'Beared ' + access_token
  }
)
t.type(rc.data, 'object', 'Error new file answer')
t.type(rc.data.storage_newfile.url, 'string')
url = rc.data.storage_newfile.url.replace( /^http:\/\/.*\/s3\//g, 'http://proxy/s3/')
// url = rc.data.storage_newfile.url.replace( /^http:\/\/.*\/s3\//g, 'http://storage:9000/')

file = 'test/test-video.mp4'
size = fs.statSync( file ).size
stream = fs.createReadStream(file)
stream.on('error', (err) => {
  console.log( 'ERROR STREAM!')
})

rc = await axios({
    method: 'put',
    url,
    data: stream,
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': size,
      'Authorization':'Beared ' + access_token
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 100000,
}).catch( function(err) {
  console.log('ERROR UPLOAD VIDEO')
})    

t.equal(rc.status, 200, 'Upload Error')

/// remove File
rc = await graphql(
  {
      query: storage.removeFile,
      variables: file_video
  },
  {
      'Authorization':'Beared ' + access_token
  }
)
t.type(rc.data, 'object', 'Error answer')
t.type(rc.data.storage_rmfile, 'object', 'error data')
t.equal(rc.data.storage_rmfile.success, true, 'Remove File Error')

rc = await graphql(
  {
      query: storage.removeFile,
      variables: file_img
  },
  {
      'Authorization':'Beared ' + access_token
  }
)
t.type(rc.data, 'object', 'Error answer')
t.type(rc.data.storage_rmfile, 'object', 'error data')
t.equal(rc.data.storage_rmfile.success, true, 'Remove File Error')

  /// Delete Storage
  rc = await graphql(
    {
        query: storage.removeStorage,
        variables: {
          storage: tmpStorage,
        }
    },
    {
        'Authorization':'Beared ' + access_token
    }
  )
  t.type(rc.data, 'object', 'Error storages answer')
  t.type(rc.data.storage_rm, 'object', 'error storages list')
  t.equal(rc.data.storage_rm.success, true, 'New Storage Error')

  ///
  rc = await graphql(
    // query
    {
        query: auth.Logout
    },
    {
      'Authorization':'Beared ' + access_token
    }
  )
      
  t.type(rc.data, 'object', 'Error LOGOUT')
  t.equal(rc.data.logout.success, true, 'success Error')

  // END
  t.end()
})
}

main()

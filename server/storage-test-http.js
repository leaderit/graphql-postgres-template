const Axios = require ('axios')
require("dotenv").config({ path: '../.env' })
const config = require('./config')
const fs = require('fs');
const GraphQLURL = 'http://localhost:8088/graphql'
const auth = require('./gql/auth.gql')
const storage = require('./gql/storage.gql')
const Stream = require('stream')


const user = {
    client_id:'ios-v1',
    client_secret:'supersecret',
    scope:'the app and the user scope',
    username:'admin',
    password:'password'
}

const file_video = {
    storage:'public',
    path:'video/',
    name:'test-video-huge.mp4'
}

var data
var rc
var access_token


const _graphql = Axios.create({
    baseURL: GraphQLURL,
    timeout: 100000, // 0 = infinity timeout
    // headers: {'X-Custom-Header': 'foobar'}
});
  
async function graphql( query, headers )
{
    const res = await _graphql.post('', query,
    {
      headers
    })
    return res.data
} 
  
const axios = Axios.create({
    timeout: 1000000, // 0 = infinity timeout
    // headers: {'X-Custom-Header': 'foobar'}
});
  
// File that needs to be uploaded.
var file = '/Users/vg/Movies/MBfin.mp4'

async function start() {

    rc = await graphql(
    {
        query: auth.Login,
        variables: user
    })
    data = rc.data 
    access_token = data.login.access_token
    // console.log( access_token )
    rc = await graphql(
        {
            query: storage.storages
        },
        {
            'Authorization':'Beared ' + access_token
        }
    )

    console.log('STORAGES:',rc.data.storages)

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
    url = rc.data.storage_newfile.url
    // url = rc.data.storage_newfile.url.replace( /^http:\/\/.*\/s3\//g, 'http://proxy/s3/')
    // console.log( url )

    file = 'test/test-video-big.mp4'
    size = fs.statSync( file ).size

    stream = fs.createReadStream(file) //, { highWaterMark: 1024 })
    stream.on('error', (err) => {
      console.log( 'ERROR STREAM!')
    })
    var count = 0
    stream.on('data', async (chunk) => {
        // await setTimeout(() => console.log(chunk.length), 1000); 
      count = count + chunk.length 
      process.stdout.write(`\rUploading ${count} bytes of data `)     
    });

    rc = await axios({
        method: 'put',
        url,
        data: stream,
        // responseType: 'stream',
        headers: {
            // 'Transfer-Encoding': 'chunked',
            'Content-Type': 'video/mp4',
            'Content-Length': size,
            'Authorization':'Beared ' + access_token
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        // onUploadProgress: function(progressEvent) {
        //     // this.uploadPercentage = parseInt(Math.round(( progressEvent.loaded / progressEvent.total) * 100);
        //     console.log(progressEvent.loaded, '/', progressEvent.total)
        // }
    }).catch( function(err) {
      console.log('ERROR UPLOAD VIDEO', err)
    })    
    
    if (rc.status==200) console.log('OK')







    rc = await graphql(
    // query
    {
        query: auth.Logout
    },
    {
        'Authorization':'Beared ' + access_token
    }
    )
          
    if (rc.data.logout.success) console.log('Logout OK')
}
try {
    start()
} catch ( err ) {
    console.log( err )
}
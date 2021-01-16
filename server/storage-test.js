const Storage = require('minio')
require("dotenv").config({ path: '../.env' })

const config = require('./config')

console.log( config.storage )

config.storage.endPoint = 'localhost'
var storage = new Storage.Client( config.storage )

// File that needs to be uploaded.
// var file = './config.js'
var file = '/Users/vg/Movies/vsms-ht-logo.mp4'

async function start() {
    // Make a bucket called europetrip.
    try {
        await storage.makeBucket('users', 'Orenburg');
    } catch (err) {
        // console.log(err)
    }
    // , function(err) {
    //     if (err) return console.log(err)

    //     console.log('Bucket created successfully in "us-east-1".')
    // });

    var metaData = {
        'Content-Type': 'video/mp4',
        // 'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        'example': 5678
    }
    // Using fPutObject API upload your file to the bucket europetrip.
    storage.fPutObject('users', 'qqq/www/81fc512a-4236-11eb-96d1-975577b0463c', file, metaData, function(err, etag) {
    // storage.fPutObject('users', 'config.js', file, metaData, function(err, etag) {
    if (err) return console.log(err)
    console.log('File uploaded successfully. etag=', etag)
    });
}

start()
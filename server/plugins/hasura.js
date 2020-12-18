'use strict'
const  { json } = require( 'body-parser' )
const Axios = require ('axios')

const fp = require('fastify-plugin')

module.exports = fp( function (fastify, opts, next ) {

    const axios = Axios.create({
        baseURL: process.env.HASURA || 'http://localhost:8080/v1/graphql', 
        timeout: 1000,
        // Сюда можно добавить собственные постоянные заголовки
        // headers: {'X-Custom-Header': 'foobar'}
    });
      
    const hasura = axios.post
    fastify.decorate('hasura', hasura)
    next()
}, {

})
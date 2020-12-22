'use strict'
const  { json } = require( 'body-parser' )
const Axios = require ('axios')

const fp = require('fastify-plugin')

module.exports = fp( function (fastify, opts, next ) {

    const cfg = { 
        ...{ 
            baseURL: 'http://graphql-engine:8080/v1/graphql',
            timeout: 0,
        },
        ...opts.hasura
    }

    console.log( 'Hasura=', { cfg } )
    const axios = Axios.create( cfg )     
    const hasura = axios.post
    fastify.decorate('hasura', hasura)
    next()
}, {

})
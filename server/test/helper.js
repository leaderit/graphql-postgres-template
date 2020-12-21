'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')
require("dotenv").config({ path: '../.env' })
const cfg = require("../config")
const Axios = require ('axios')

const backendURL = 'http://backend:3000/api'
const GraphQLURL = 'http://graphql-engine:8080/v1/graphql'

const backend = Axios.create({
  baseURL: backendURL,
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// function backend()
// {
//   return _backend
// } 

const _graphql = Axios.create({
  baseURL: GraphQLURL,
  timeout: 10000,
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
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return cfg
}

// automatically build and tear down our instance
function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.tearDown(app.close.bind(app))

  return app
}

module.exports = {
  config,
  build,
  backendURL,
  GraphQLURL,
  axios,
  backend,
  graphql,
  _graphql
}

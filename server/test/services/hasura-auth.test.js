'use strict'

const { test } = require('tap')
const { build } = require('../helper')
const { config } = require('../helper')
const Axios = require ('axios')

test('auth is loaded', async (t) => {
  const user = {
    username:'login1',
    password:'password1'
  }
  const baseURL = 'http://backend:3000/api'
  const GraphQL = 'http://graphql-engine:8080/v1/graphql'
  var res
  // t.plan(3)
  const axios = Axios.create({
    baseURL,
    timeout: 1000,
  });

  res = await axios.get( '/auth/hasura',
  {
    headers: {
      'x-hasura-login':user.username,
      'x-hasura-password':user.password
    },
  })
  
  t.equal(res.status, 200 )
  t.same(res.data, 
    {
      'X-Hasura-User-Id': '',
      'X-Hasura-Role': 'anonymous',
      'X-Hasura-Login': user.username,
      'X-Hasura-Password': user.password
    }    
  )

  t.end()

})

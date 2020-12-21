'use strict'

const helper = require('../helper')
const { test } = require('tap')
const backend = helper.backend

test('Test Hasura Auth Callback', async (t) => {
  const user = {
    username:'login1',
    password:'password1'
  }
  var res
  
  res = await backend.get( '/auth/hasura',
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
      'X-Hasura-Password': user.password,
      'X-Hasura-Client':'',
      'X-Hasura-Client-Secret':''
    }    
  )

  t.end()
})

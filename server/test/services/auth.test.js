'use strict'

const helper = require('../helper')
const { test } = require('tap')
const { build } = helper 
const { config } = require('../helper')
const auth = require('../../gql/auth.gql')
const backend = helper.backend
const graphql = helper.graphql

test('Test Hasura Auth Callback', async (t) => {
  const user = {
    username:'login1',
    password:'password1'
  }

  var res
  // t.plan(3)
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
      'X-Hasura-Password': user.password
    }    
  )
  t.end()
})


test('TEST: Admin Auth', async (t) => {
  // const user = {
  //   username:'login1',
  //   password:'password1'
  // }

  const user = {
    username:'admin',
    password:'password'
  }

  var data
  var rc
  var refresh_token, access_token

  rc = await graphql(
  // query
  {
      query: auth.Login,
      variables: user
  })
  
  data = rc.data

  t.notEqual(data, undefined, 'data is UNDEFINED')
  t.notEqual(data, null, 'data is NULL')
  t.notEqual(data.login.access_token, null, 'access_token is NULL')
  t.notEqual(data.login.refresh_token, null, 'refresh_token is NULL')

  refresh_token = data.login.refresh_token

  // Проверяем большое количество отновлений сессии
  for ( var i=0; i<10; i++ ) {
    rc = await graphql(
      // query
      {
          query: auth.Token,
          variables: {
            "client":"iOS Test Application",
            "client_secret":"Super App password",
            "refresh_token": refresh_token
        }
      })
    
      data = rc.data

      t.notEqual(data, undefined, 'rc is UNDEFINED')
      t.notEqual(data, null, 'rc is NULL')
      t.notEqual(data.token.access_token, null, 'access_token is NULL')
      t.notEqual(data.token.refresh_token, null, 'refresh_token is NULL')

      refresh_token = data.token.refresh_token
      access_token = data.token.access_token
  }

  rc = await graphql(
    // query
    {
        query: auth.Profile
    },
    {
      'Authorization':'Beared ' + access_token
    }
  )
    
  data = rc.data

  t.notEqual(data, undefined, 'data is UNDEFINED')
  t.notEqual(data, null, 'data is NULL')
  t.equal(data.profile.user.login, user.username, 'username error')
  t.equal(data.profile.user.role.name, 'admin', 'role name error')

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
    
  data = rc.data

  t.notEqual(data, undefined, 'data is UNDEFINED')
  t.notEqual(data, null, 'data is NULL')
  t.equal(data.logout.success, true, 'success Error')

  t.end()
})

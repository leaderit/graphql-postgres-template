'use strict'

const helper = require('../helper')
const { test } = require('tap')
const auth = require('../../gql/auth.gql')
const backend = helper.backend
const graphql = helper.graphql

test('TEST: Admin Auth', async (t) => {
  
  const user = {
    client_id:'ios-v1',
    client_secret:'supersecret',
    scope:'the app and the user scope',
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

  // Проверяем большое количество обновлений сессии
  for ( var i=0; i<1; i++ ) {
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

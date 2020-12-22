'use strict'

const helper = require('../helper')
const { test } = require('tap')
// const { build } = helper 
// const { config } = require('../helper')
const auth = require('../../gql/auth.gql')
// const backend = helper.backend
const graphql = helper.graphql


test('TEST: Register and unregister User', async (t) => {
  var user = {
    login:'login10',
    password:'password',
    password2: 'password',
    client_id:'ios-v1',
    client_secret:'supersecret',
    scope:'',
    org_id: null
  }

  const max = 100000

  var tokens = []
  var data
  var rc
  var refresh_token, access_token

  // // Проверяем большое количество регистраций и удалений
  for ( var i=0; i<max; i++ ) {
    user.login = 'login-'+i

    rc = await graphql(
    // query
    {
        query: auth.Register,
        variables: user
    })
    
    data = rc.data

    t.notEqual(data, undefined, 'data is UNDEFINED')
    t.notEqual(data, null, 'data is NULL')
    t.notEqual(data.register.access_token, null, 'access_token is NULL')
    t.notEqual(data.register.refresh_token, null, 'refresh_token is NULL')

    // refresh_token = data.register.refresh_token
    // access_token = data.register.access_token

    tokens[i] = {
      refresh_token: data.register.refresh_token,
      access_token: data.register.access_token  
    }

  }
  for ( var i=0; i < max; i++ ) {
    ///
    rc = await graphql(
      // query
      {
          query: auth.Unregister
      },
      {
        'Authorization':'Beared ' + tokens[i].access_token
        // 'Authorization':'Beared ' + access_token
      }
    )
      
    data = rc.data

    t.notEqual(data, undefined, 'data is UNDEFINED')
    t.notEqual(data, null, 'data is NULL')
    t.equal(data.unregister.success, true, 'success Error')
  }
  t.end()
})

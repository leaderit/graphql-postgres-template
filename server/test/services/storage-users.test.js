'use strict'

const helper = require('../helper')
const { test } = require('tap')
// const { build } = helper 
// const { config } = require('../helper')
const auth = require('../../gql/auth.gql')
const storage = require('../../gql/storage.gql')
// const backend = helper.backend
const graphql = helper.graphql
const axios = helper.axios


test('TEST: Storage to User homes', async (t) => {
  var user = {
    login:'login-storage',
    password:'password',
    password2: 'password',
    client_id:'ios-v1',
    client_secret:'supersecret',
    scope:'storage test user',
    org_id: null
  }

  var tokens = {}
  var data
  var rc
  var refresh_token, access_token

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

    tokens = {
        refresh_token: data.register.refresh_token,
        access_token: data.register.access_token  
    }


    // for ( var i=0; i < max; i++ ) {


    // }
    ///
    rc = await graphql(
        // query
        {
            query: storage.storages
        },
        {
            'Authorization':'Beared ' + tokens.access_token
        }
    )
    data = rc.data

    t.notEqual(data, undefined, 'data is UNDEFINED')
    t.notEqual(data, null, 'data is NULL')
    t.notEqual(data.storages, undefined, 'storages is UNDEFINED')
    t.notEqual(data.storages, null, 'storages is NULL')

    // t.equal(data.storages.success, true, 'success Error')


    ///
    rc = await graphql(
      // query
      {
          query: auth.Unregister
      },
      {
        'Authorization':'Beared ' + tokens.access_token
      }
    )
      
    data = rc.data

    t.notEqual(data, undefined, 'data is UNDEFINED')
    t.notEqual(data, null, 'data is NULL')
    t.equal(data.unregister.success, true, 'success Error')

    // END
    t.end()
})

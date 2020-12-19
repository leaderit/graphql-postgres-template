'use strict'
const crypto = require('crypto')

//  Создание сессии в Redis
async function createSession( fastify, user )
{
    const { redis } = fastify
    const { tokenLife } = fastify
    const token = crypto.randomBytes(32).toString('hex')
    const refreshToken = crypto.randomBytes(32).toString('hex')
    const timestamp = Date.now()
    const session = { 
        token_type: "Bearer",
        access_token: token, 
        refresh_token: refreshToken,
        expires_in: tokenLife,
        user_id: user.id, 
        success: true, 
    }    
    //  Установим сессию в Redis
    await redis.multi()
    .setex('token/'+token, tokenLife, JSON.stringify( { user } ))
    .setex('refreshToken/'+refreshToken, tokenLife * 2, JSON.stringify({ timestamp, user, token, session }))
    .setex('user/'+user.login, tokenLife * 2, JSON.stringify({ token, refreshToken }))
    .exec()
    // Возвращаем данные сессии
    return session
}

//  Удаление сессии из Redis
async function deleteSession( fastify, user )
{
    const { redis } = fastify
    const { deleteSessionTimeout } = fastify

    if ( user ) {
        const oldSessionData = await redis.get('user/'+user.login)
        if ( oldSessionData ) {
            const oldSession = JSON.parse( oldSessionData )
            if ( oldSession ) {
                const rc = await redis.multi()
                .del('token/'+oldSession.token )
                .expire('refreshToken/'+oldSession.refreshToken, deleteSessionTimeout )
                .expire('user/'+user.login, deleteSessionTimeout )
                .exec()
            }
            return true
        }
    }
    return false
}

/*
Вход пользователя в сервис
*/
async function login( fastify, request, reply ) {
    const { hasura } = fastify
    const { redis } = fastify
    const { tokenLife } = fastify
    const login  = request.body.input

    const { data } = await hasura('', {
        query: //userLogin,
        `
        query getUser($password: String!, $login: String!) {
            users (where: {password: {_eq: $password}, login: {_eq: $login}}, limit: 1) {
                id
                login
                name
                role {
                  access
                  id
                  name
                }          
            }
            applications {
                id
                client_id
            }            
          }
        `,
        variables: {
            login: login.username,
            password: login.password
        }
    }, {
        headers: {
            'X-Hasura-Login': login.username,
            'X-Hasura-Password': login.password,
            'X-Hasura-Client': login.client_id,
            'X-Hasura-Client-Secret': login.client_secret,
        }
    })
    if ( data.data ) {
        if ( data.data.users.length == 1 && data.data.applications.length == 1 ) {
            const user = data.data.users[0]
            const token = crypto.randomBytes(32).toString('hex')
            const refreshToken = crypto.randomBytes(32).toString('hex')

            await deleteSession( fastify, user )
            user.role = user.role || { name:'user', id: 1000, access: {} }
            user.scope = login.scope
            user.application = data.data.applications[0]
            
            //  Установим сессию в Redis
            return await createSession( fastify, user )    
        }
    }
    // reply.statusCode = 401
    return { 
        success: false, 
        error: 'incorrect user name or password'
    }        
}

/*
Выход пользователя из сервиса
*/
async function logout( fastify, request, reply ){
    const { user } = request
    const { token } = request

    console.log('logout()= ', { user, token } )
    if ( await deleteSession( fastify, user ) ) 
    {
        return { success: true }
    }
    return { success: false, error:'not logged in'}
}

/*
Установка организации по умолчанию для активного пользователя
*/
async function setOrg( org ){
    const { req, hasura, token } = this
    const user = sessions.tokens[ token ] || null
    if ( user ) {
        //console.log( { org: org.org_id, user: user.id } )
        if ( org.org_id ) {
            user.org_id = org.org_id
            try {          
                const { data } = await hasura('', {
                    query: 
                    `
                    mutation updateOrg($id: uuid!, , $org_id: uuid! ) {
                        update_users_by_pk(pk_columns: {id: $id}, _set: { org_id: $org_id }) {
                            id
                            
                        }
                    }                
                    `,
                    variables: {
                        id: user.id,
                        org_id: org.org_id
                    }
                }, 
                {
                    headers: {
                        "Authorization": req.headers.authorization,
                    }
                })
                if ( data.errors ) console.log( data.errors )
            } catch ( err ) {
                console.log( err )
            }        
        }
        return { user }
    } else return { error:'not logged in'}
}

// Возвращает профиль пользователя
async function profile(fastify, request, reply){
    var user = request.user
    if ( user ) {
        return { user_id: user.id }
    }
    return { user_id: null }
}

// Обновление жетонов сессии
async function token(fastify, request, reply){
    const { redis } = fastify
    const { input } = request.body
    const { minTokenLife } = fastify

    if ( input.refresh_token ) {
        const rawdata = await redis.get('refreshToken/'+input.refresh_token)
        if ( rawdata ) {
            const data = JSON.parse( rawdata )
            if ( data ) 
            { 
                if ( Date.now() - data.timestamp > minTokenLife ) {
                    await deleteSession( fastify, data.user )
                    return await createSession( fastify, data.user )
                } else return data.session
            }
        } 
    }
    return { 
        success: false, 
        error: 'session not found'
    }    
}

module.exports = function (fastify, opts, next) {
    const { hasura } = fastify

    fastify.decorate ( 'tokenLife', opts.auth.tokenLife || 0 )
    fastify.decorate ( 'minTokenLife', opts.auth.minTokenLife * 1000 || 10000 )
    fastify.decorate ( 'deleteSessionTimeout', opts.auth.deleteSessionTimeout || 5 )

    fastify.post('/login', async function (request, reply) 
    {
      reply.send( await login(fastify, request, reply) )
    })     

    fastify.post('/logout', async function (request, reply) 
    {
      reply.send( await logout(fastify, request, reply) )
    })     

    fastify.post('/profile', async function (request, reply) 
    {
      reply.send( await profile(fastify, request, reply) )
    })

    fastify.post('/token', async function (request, reply) 
    {
      reply.send( await token(fastify, request, reply) )
    })

    next()
}


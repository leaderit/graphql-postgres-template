'use strict'
const crypto = require('crypto')
const auth = require('../../gql/auth.gql')

function createToken() {
    return crypto.randomBytes(32).toString('hex')
}

// Создание соли
function createSalt() {
    return crypto.randomBytes(128).toString('base64')
}

// Функция вычисления хеша для имени, пароля и соли
function passwordHash( login, password, salt ) {
    return crypto.pbkdf2Sync(password+login, salt, 10000, 128, 'sha512').toString('base64')
}


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
    const { backendSecret } = fastify
    const login  = request.body.input

    const { data } = await hasura('', {
        query: //userLogin,
        `
        query getUser($login: String!) {
            users (where: {login: {_eq: $login}}, limit: 1) {
                id
                login
                name
                password
                salt
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
            login: login.username
        }
    }, {
        headers: {
            'X-Hasura-Login': login.username,
            'X-Hasura-Password': login.password,
            'X-Hasura-Client': login.client_id,
            'X-Hasura-Client-Secret': login.client_secret,
            'X-Hasura-Backend': backendSecret
        }
    })
    if ( data.data ) {
        if ( data.data.users.length == 1 && data.data.applications.length == 1 ) {
            const user = data.data.users[0]
            // Проверить хеш пароля 
            let password = login.password
            if ( user.salt ) password = passwordHash( login.username, login.password, user.salt )
            if ( !(user.password === password)) user = null
            if ( user ) {
                await deleteSession( fastify, user )
                user.role = user.role || { name:'user', id: 1000, access: {} }
                user.scope = login.scope
                user.application = data.data.applications[0]
                //  Установим сессию в Redis
                return await createSession( fastify, user )
            }
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

    // console.log('logout()= ', { user, token } )
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


// Создает и возвращает профиль пользователя
async function register(fastify, request, reply){
    const { hasura } = fastify
    const { redis } = fastify
    const { tokenLife } = fastify
    const register  = request.body.input
    const { backendSecret } = fastify

    // Проверяем совпадение паролей
    if ( register.password === register.password2 ) {

        // Проверяем регистрацию приложения
        const app = await hasura('', {
            query: //auth.Application,
            `
            query Application($client_id: String!, $client_secret: String!) {
                applications (where: {client_id: {_eq: $client_id}, client_secret: {_eq: $client_secret}}, limit: 1)
                {
                    id
                    client_id
                }            
            }
            `,
            variables: {
                client_id: register.client_id,
                client_secret: register.client_secret
            }
        }, {
            headers: {
                'X-Hasura-Client': register.client_id,
                'X-Hasura-Client-Secret': register.client_secret,
                'X-Hasura-Backend': backendSecret
            }
        })

        var application = null
        if ( app.data ) application = app.data.data.applications[0]

        const salt = createSalt()
        const pwHash = passwordHash( register.login, register.password, salt )

        console.log( {application} )
        // Записываем пользователя и пароль
        const { data } = await hasura('', {
            query: 
            `
            mutation Register (
                $login: String!
                $name: String!
                $password: String!
                $salt: String!
            ){
                insert_users_one( object: {
                    login: $login, 
                    name: $name, 
                    password: $password,
                    salt: $salt
                }) {
                    id
                    login
                    name
                    role {
                    access
                    id
                    name
                    }          
                }
            }
            `,
            variables: {
                login: register.login,
                name: register.login,
                password: pwHash,
                salt: salt
            }
        }, {
            headers: {
                'X-Hasura-Login': register.login,
                'X-Hasura-Password': register.password,
                'X-Hasura-Client': register.client_id,
                'X-Hasura-Client-Secret': register.client_secret,
                'X-Hasura-Backend': backendSecret
            }
        })

        if ( data.data ) {
            if ( data.data.insert_users_one && application ) {
                const user = data.data.insert_users_one
                user.role = user.role || { name:'user', id: 1000, access: {} }
                user.scope = register.scope
                user.application = application
                //  Установим сессию в Redis
                return await createSession( fastify, user )    
            }
        }
    }
    // END password = password2
    return { 
        success: false, 
        error: 'incorrect user name or password'
    }  
}


// Удаляет профиль пользователя
async function unregister(fastify, request, reply){
    const { hasura } = fastify
    const unregister  = request.body.input

    var user = request.user
    if ( user ) {
        console.log( user, request.headers )
        const { data } = await hasura('', {
            query: 
            `
                mutation UnRegister($id: uuid!) {
                    delete_users_by_pk(id: $id) {
                        id
                    }
                }
            `,
            variables: {
                id: user.id
            }
        }, {
            headers: {
                "Authorization": request.headers.authorization,
            }
        })
        if ( data.data ) {
            if ( data.data.delete_users_by_pk.id === user.id ) {
                if ( await deleteSession( fastify, user ) ) 
                {
                    return { success: true }
                }
                return { success: false, error:'not logged in'} 
            }           
        }
    }
    return { 
        success: false, 
        error: 'incorrect user'
    }  

}

module.exports = function (fastify, opts, next) {
    const { hasura } = fastify

    // НЕ ПЛАГИН - ДЕКОРАТОРЫ РАБОТАТЬ НЕ БУДУТ - исправить!!! 
    fastify.decorate ( 'tokenLife', opts.auth.tokenLife || 0 )
    fastify.decorate ( 'minTokenLife', opts.auth.minTokenLife * 1000 || 10000 )
    fastify.decorate ( 'deleteSessionTimeout', opts.auth.deleteSessionTimeout || 5 )
    fastify.decorate ( 'createToken', createToken )

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

    fastify.post('/register', async function (request, reply) 
    {
      reply.send( await register(fastify, request, reply) )
    })

    fastify.post('/unregister', async function (request, reply) 
    {
      reply.send( await unregister(fastify, request, reply) )
    })

    next()
}


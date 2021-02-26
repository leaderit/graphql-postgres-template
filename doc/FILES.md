# GraphQL backend based on PostgreSQL database with Auth, Access rights and custom Business Logic

## Authorisation and Registration Queries


Request Headers:
{
    Authorisation: {{token_type}} {{token}},    // Token from login request
    Authorisation-Code: {{code_id}} {{code}}    // code_id from Asking code request and code, provided by user
}

Login Headers
{
    Authorisation-Code: {{code_id}} {{code}}
}


## Authorisation Code

    query:
    mutation AskCode ( $action: String! ) {
        askcode ( action: $action ) {
            code_id
            action
            code
        }
    }

    variables:
    {
        "action":"login"
    }

    return example:
    {
        "data": {
            "askcode": {
                "code_id": "58546e33-9e79-4d34-8fef-adcf410b043f",
                "action": "login",
                "code": null
            }
        }
    }

## Registration



## Authorisation

    query:
    query Login($password: String!, $username: String!, $scope: String = "", $client_secret: String = "", $client_id: String = "") 
    {
        login(password: $password, username: $username, client_id: $client_id, client_secret: $client_secret, scope: $scope) 
        {
            access_token
            refresh_token
            success
            error
            user_id
            expires_in
            token_type
        }
    }

    variables:
    {
        "client_id":"ios-v1",
        "client_secret":"supersecret",
        "scope":"scope1",
        "username":"login1",
        "password":"password1"
    }

    return example:
    {
        "data": {
            "login": {
                "access_token": "1c4e0520f3144d90300c894390ed552035660598ac44417143899f5c3ecd7459",
                "refresh_token": "329ca29b2270168221118c76de38eaf888d3a6e1cfa598bf4dccdaac007811f3",
                "success": true,
                "error": null,
                "user_id": "9e74ce44-1ae6-11eb-ae92-8f6f1e8276cc",
                "expires_in": 3600,
                "token_type": "Bearer"
            }
        }
    }

    If a login action was successfull, the variable 'success' will content true.
    In other case it will content 'false' and 'error' will content text of the error. 
    
## User Profile

    query:
    query Profile {
        profile {
            user {
            id
            login
            name
            role {
                name
            }
            }
        }
    }

    return example:
    {
        "data": {
            "profile": {
                "user": {
                    "id": "9e74ce44-1ae6-11eb-ae92-8f6f1e8276cc",
                    "login": "login1",
                    "name": "Name 1",
                    "role": {
                        "name": "user"
                    }
                }
            }
        }
    }

## Copyrights

(c) Valerii Grazhdankin, Moscow, Russia
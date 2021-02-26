# GraphQL backend based on PostgreSQL database with Auth, Access rights and custom Business Logic

## Authorisation and Registration Queries

For Authtorisation and registration queries you may provide 
`Authorisation-Code` header. 

For other queries you must provide `Authorisation` header with Bearer token, returned
from Register or Login queries. If you business logic needs, you may
send `Authorisation-Code` header and check confirmation of the operation
before continue an destructive or important action.

### Request Headers:

    {
        Authorisation: {{token_type}} {{token}},    // Token from login request
        Authorisation-Code: {{code_id}} {{code}}    // code_id from Asking code request and code, provided by user
    }

Token type is `Bearer` for the template, or any other for your own AUTH realization.

### Login Headers:

    Login Headers
    {
        Authorisation-Code: {{code_id}} {{code}}
    }


## Authorisation Code

You may ask a confirmation code for Login, Registration or any other important action
of you backend. You ask code for exact action and then confirm the action by sending
returned code in headers for the action query.

### query:

    mutation AskCode ( $action: String! ) {
        askcode ( action: $action ) {
            code_id
            action
            code
        }
    }

You can return valid code in an answer of the request for debug purposes. For production
returned code is null. For 2 factors security reasons you must send the code via alternative 
communications providers: SMS, chat bots, email or others.  

### variables:

    {
        "action":"login"
    }

### return example:

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

### query:
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

### variables:
    {
        "client_id":"ios-v1",
        "client_secret":"supersecret",
        "scope":"scope1",
        "username":"login1",
        "password":"password1"
    }

### return example:
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
In other case it will content 'false' and 'error' will content a text of the error. 
    
## User Profile

The query returns current user's profile with additional and expanded data. 
You can configure any types and set of the data as you wish in your backend.

You can request additional data from caches, databases, another queries and
send it to the user in the request.

### query:

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

### return example:

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
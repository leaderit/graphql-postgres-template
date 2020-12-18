
module.exports = {
///
Login:
  `
  query Login(
    $password: String!, 
    $username: String!, 
    $scope: String = "", 
    $client_secret: String = "", 
    $client_id: String = ""
  ){
    login(
      password: $password, 
      username: $username, 
      client_id: $client_id, 
      client_secret: 
      $client_secret, 
      scope: $scope
    ){
      access_token
      refresh_token
      success
      error
      user_id
      user {
        id
        login
        name
        password
      }
      expires_in
      token_type
    }
  }
  `,
///
Logout:
  `
  query Logout {
    logout {
      error
      success
    }
  }
  `,
///
Profile:
  `
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
  `,
///
Token:
  `
  query Token(
    $client: String = "",
    $client_secret: String = "",
    $refresh_token: String = ""
  ){
    token(
      client: $client,
      client_secret: $client_secret,
      refresh_token: $refresh_token
    ){
      access_token
      error
      success
      refresh_token
      expires_in
      token_type
      user_id
    }
  }
  `
}



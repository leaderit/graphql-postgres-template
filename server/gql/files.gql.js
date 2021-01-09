
module.exports = {
///
files:
  `
  query Files(
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
      client_secret: $client_secret, 
      scope: $scope
    ){
      access_token
      refresh_token
      success
      error
      user_id
      expires_in
      token_type
    }
  }
  `,
///
file_by_id:
  `
  query File($id: uuid! = "") {
    files_by_pk(id: $id) {
      created_at
      descr
      filename
      group
      id
      name
      org_id
      owner_id
      public
      size
      type
      updated_at
      uploaded
    }
  }
  `,
///
insert:
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
  `,
///
update:
  `
  query Logout {
    logout {
      error
      success
    }
  }
  `,
///
delete:
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
}



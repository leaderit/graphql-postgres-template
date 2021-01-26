// Путь к файловому хранилищу с правами доступа
'use strict'
const path = require('path')

module.exports = {
  user: { url:'/files', path:'/storage', template:'/users/${user_id}/${file_id}'},
  org: { url:'/files', path:'/storage', template:'/orgs/${org_id}/${file_id}'},
  public: { url:'/files', path:'/storage', template:'/public/${file_id}'},
}

module.exports = {
  baseURL: process.env.HASURA || 'http://localhost:8081/graphql',
  timeout: 0,  // default 0 milisec
  // Сюда можно добавить собственные постоянные заголовки
  // headers: {
  //   'X-Custom-Header': 'foobar'
  // }
}

// Authorisation parameters
module.exports = {
  tokenLife : 3600, // Authorisation token life time in seconds
  // Если обновление жетона (токена) производится менее чем за минимальное время жизни
  // возвращается тот же жетон (токен)
  minTokenLife : 15,
  deleteSessionTimeout: 5,
  // Authorisation code security section
  codeLife: 240, // Authorisation code life time in seconds
  codeSendDelay: 1, // Delay before send code in seconds
  codeCheckDelay: 5, // delay before check code in seconds
  actions: [
    'login',
    'register',
    'unregister'
  ]
}

/* 
Ссылки на плагины и настройки:

https://github.com/fastify/fastify-redis
https://github.com/luin/ioredis

Кеш с поддержкой подписки на события
Реализуется через 2 соединения, первое для работы
второе - для подписки на события
Обязательно установить конфигурацию redis
notify-keyspace-events = AKE
Добавляет к серверу следующие переменные:

const { redis } = fastify
const { redisEvent } = fastify

Стандартная подписка плагина: __keyevent*__:expired
При истечении времени существования любого ключа redis вызывается функция декоратора fastify

onRedisEvent

со следующими параметрами
fastify.onRedisEvent( channel, message, data )

*/
'use strict'
const fp = require('fastify-plugin')
const Redis = require('ioredis')

module.exports = fp(function (fastify, opts, next) {
	opts.redis = opts.redis || {}
	opts.redis.client = null
	opts.redis.keyPrefix = opts.redis.keyPrefix || ''

	try {
		const redis = new Redis( opts.redis )
		// Отдельное соединение для подписчика событий
		const redisEvent = redis.duplicate()
		opts.redis.client = redis
		// Установим режим передачи событий для сервера
		redisEvent.config('set', 'notify-keyspace-events', 'AKE')
		// Подпишемся на события изменения ключей
		fastify.decorate('redisEvent', redisEvent)
		//redis.psubscribe("__keyspace*__:*", function(err, count) {});
		// Подпишемся на ключи, которые истекли
		redisEvent.psubscribe("__keyevent*__:expired", function(err, count) {});
		// redis.psubscribe("__key*__:*", function(err, count) {});
		// Обработчик событий может быть в другом месте  	
		redisEvent.on("pmessage", function(channel, message, data) {
			//console.log('pmessage', channel, message, data)
			if ( fastify.hasDecorator('onRedisEvent') ) fastify.onRedisEvent( channel, message, data )
		});
	
		fastify.register(require('fastify-redis'), opts.redis )

	} catch ( err ) {
		return next( err )
	}
	next()
})

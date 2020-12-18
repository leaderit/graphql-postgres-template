'use strict'
const fp = require('fastify-plugin')
const SocketIOServer = require('socket.io');

module.exports = fp(function (fastify, opts, next) {
    opts.websocket = opts.websocket || {}
    try {
		const io = new SocketIOServer(fastify.server, opts.websocket);
        fastify.decorate('io', io);
        // Рассылка события группе через сокет
        fastify.decorate('emitGroup', function ( event, groupid, data, socket_in = null ) {
            var cons = fastify.io.sockets.connected
            for (var key in cons) {
                const socket = cons[key]
                const sgroupid = socket.groupid || '*'
                const token = socket.token || null;
                if ( groupid == sgroupid && socket != socket_in ) {
                    socket.emit(event, data);
                    //console.log( 'emit group', sgroupid, { event, groupid, data, token })
                }
            }
        })
        fastify.decorate('emitClient', function ( event, clientid, data ) {
            var cons = fastify.io.sockets.connected
            for (var key in cons) {
                const socket = cons[key]
                const sclientid = socket.clientid || '*'
                if ( clientid == sclientid ) {
                    socket.emit(event, data);
                    //console.log('emitClient(', event, ',', clientid, ',', data, ')')
                }
            }
        })
        // Обработчики событий
        io.on('connection', function(socket){
            console.log('user connected');
            // Настроим обработчики
            socket.on('disconnect', function() {
                console.log('user disconnected');
            });
            // Приветствие при выборе группы участков
            socket.on('hello', function(data) {
                socket.emit('hello', data);
                socket.clientid = data.data.clientid
                socket.groupid = data.data.groupid
                socket.token = data.data.token || null;
                console.log('socket user hello:', { clientid: socket.clientid, groupid: socket.groupid, token: socket.token });
            });
            // Событие при выборе и просмотре параметров участка
            socket.on('selected', function(data){
                console.log('user selected', this.clientid, data.data.land.idx );//data);
                fastify.emitGroup('selected', data.data.groupid, {
                    data: { 
                        land: {
                            id: data.data.land.knum,
                            groupid: data.data.groupid, 
                            landid: data.data.land.idx 
                        } 
                    }
                }, this)
            });
        });
            
		next();
	} catch (error) {
		next(error);
	}    
})

var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var Server = function (port) {
    this.port = port;
    this.app = express();
    this.server = http.Server(this.app);
    this.io = socketio(this.server);
};

Server.prototype.start = function () {
    this.server.listen(this.port);

    this.app.use(express.static(__dirname + '/../public'));

    var self = this;
    this.io.on('connection', function (socket) {

        var address = socket.request.connection._peername;
        console.log('**********************************************************');
        console.log('Nova ligacao do endereco -> ' + address.address + " : " + address.port);
        console.log('**********************************************************');

        socket.emit('welcome', {data: 'welcome'});
        socket.on('message', function (data) {
            self.io.sockets.emit('message', data);
        });
        socket.on('msgappend', function (data) {
            socket.broadcast.emit('msgappend', data);
        });
        
        
        
        socket.on('disconnect', function () {
            console.log('Got disconnect!');
        });
    });
    console.log('Server do bufo a bombar!');
};

module.exports = Server;
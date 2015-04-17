var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var clientes = [];
var numclientes = 0;
var color = "white";

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
        if (typeof clientes[address.port] === "undefined") {
            clientes[address.port] = socket.id;
            console.log("Socket id Adicionado - " + socket.id);
            ++numclientes;
        }
        
        socket.emit('getcolor', {'cor': color});
        
        socket.on('setcolor', function (data) {
            color = data.cor;
            self.io.sockets.emit('getcolor', data);
        });    
    });
    console.log('Server do bufo a bombar!');
};

module.exports = Server;
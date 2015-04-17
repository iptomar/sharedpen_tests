var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var clientes = [];
var numclientes = 0;
var msgChat = "";
var color = "default";

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

        socket.emit('welcome', {data: 'welcome'});

        socket.on('message', function (data) {
            self.io.sockets.emit('message', data);
            msgChat += data.user + ":" + data.data + ',';
        });

        socket.on('msgappend', function (data) {
            socket.broadcast.emit('msgappend', data);
        });
        socket.on('mouseMove', function (data) {
            socket.broadcast.emit('mouseMove', data, address.port, socket.id);
        });

        socket.on("textExist", function () {
            socket.broadcast.emit("requestOldText");
        });

            socket.emit('OldmsgChat', msgChat);

        socket.on("returnOldText", function (data) {
            socket.broadcast.emit("returnOldText", data);
        });

        socket.emit('getcolor', {'cor': color});

        socket.on('setcolor', function (data) {
            color = data.cor;
            self.io.sockets.emit('getcolor', data);
        });

        socket.on('disconnect', function () {
            socket.broadcast.emit('diconnected', socket.id);
            clientes.splice(clientes.indexOf(socket), 1);
            console.log("Socket id removido - " + socket.id);
            --numclientes;
            if (numclientes <= 0) {
                console.log("Sem Clientes ligado");
                msgChat = "";
            }
        });
    });
    console.log('Server do SharedPen On!');
    console.log('A aguardar por clientes...');
};

module.exports = Server;
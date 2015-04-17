var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var clientes = [];
var numclientes = 0;


var tabsID = [];
var tabsTxt = [];



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
        socket.emit("Tabs", {id: tabsID,
                             txt: tabsTxt });
        
        
        socket.on('message', function (data) {
            self.io.sockets.emit('message', data);
        });
        socket.on('msgappend', function (data) {
            var id = data.id;
            var char = data.data;
            var pos = data.pos;
            actualizaTabs(id,char,pos);
        
            socket.broadcast.emit('msgappend', data);
        });
        socket.on('mouseMove', function (data) {
            socket.broadcast.emit('mouseMove', data, address.port, socket.id);
        }); 
        socket.on("TabsChanged", function (data) {
                 
            socket.broadcast.emit("TabsChanged", data);
        });
        
        
        socket.on("textExist", function () {
            socket.broadcast.emit("requestOldText");
        });
        socket.on("returnOldText", function (data) {
            socket.broadcast.emit("returnOldText", data);
        });
                
        socket.on('disconnect', function () {
            socket.broadcast.emit('diconnected', socket.id);
            clientes.splice(clientes.indexOf(socket), 1);
            console.log("Socket id removido - " + socket.id);
            --numclientes;
            if (numclientes <= 0) {
                console.log("Sem Clientes ligado");
            }
        });
    });
    console.log('Server do bufo a bombar!');
};

module.exports = Server;

        // *******************************************************************
        // dados recebidos pelo socket para o browser
        // *******************************************************************
        // recebe o codigo ASCII da tecla recebida, converte-a para
        // carater e adiciona-o na posicao coreta
     function actualizaTabs (idd,charr,poss) {
         
         console.log(idd + "\n" +charr+ "\n" +poss);
         
        var id= idd.substring(4)-1;
        //console.log(id);    
        var str = tabsTxt[id];
         var char =charr;
        var pos=poss;
        var str1 = "";
         
          if (char === 8 /* backspace*/
            || char === 46 /* delete */) {
              if (char === 8) {
                if (pos > 0) {
                  str1 = str.splice(0, pos - 1) + str.splice(pos);
                } else {
                  str1 = str.splice(pos);
                }
              } else if (data.data === 46) {
                str1 = str.splice(0, pos) + str.splice(pos + 1);
              }
            } else {
              //str1 = [str.splice(0, pos), String.fromCharCode(char), str.splice(pos)].join('');
                //str1=str.splice(0, pos) + String.fromCharCode(char) + str.splice(pos);
                
            }
            tabsTxt[id] = str1;
          };
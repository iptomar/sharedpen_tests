var users = [];
var numUsers = 0;
var socket = "";
var username = "";

$(document).ready(function () {

    // cria a ligação com o servidor que disponibiliza o socket
//    socket = io.connect(window.location.href);

    // coloca o cursor para introduzir o nome do utilizador
    $("#username").focus();

    // ao carregar em enter no nome do utilizador carrega no button
    $("#username").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#startlogin").click();
        }
    });

    // evento de carregar no button para fazer o login
    $("#startlogin").click(function () {
        username = $("#username").val();
        if ($.trim(username) !== "") {
            $("#div-login").css({
                display: "none"
            });
            $("#contentor").css({
                "visibility": "visible"
            });
            $("#atualuser").html(
                    "Utilizador atual <u><i><b>" +
                    username +
                    "</b></i></u>");
            // envia o nome do utilizdore a posicao do mouse
//            socket.emit('mouseMove', {
//                'user': username,
//                'x': 10000,
//                'y': 10000
//            });
            // envia ao servidor o pedido do texto que os outros 
            // utilizadores possuem na textarea
//            socket.emit("textExist");
            $("#msg1").focus();
        } else {
            $("#erro_name").html("Nome Incorreto!");
            setTimeout(function () {
                $("#erro_name").animate({
                    opacity: 0
                }, 1000, function () {
                    $("#erro_name").html("");
                    $("#erro_name").css({
                        opacity: 1
                    });
                });
            }, 500);
        }
    });

    // Atribui a largura da textarea
    $("#msg").css({
        width: $(window).width() * 0.68,
        height: $(window).height() * 0.75
    });
    $("#contentorListaUsers").css({
        width: $(window).width() * 0.23,
        height: $("#msg").height()
    });

    // *******************************************************************
    // dados enviadas pelo socket para o servidor
    // *******************************************************************
    // evia as cordenados do ponteiro do rato e do nome do utilizador
//    $(window).on("mousemove", function (event) {
//        socket.emit('mouseMove', {
//            'user': username,
//            'x': event.pageX,
//            'y': event.pageY
//        });
//    });

    // envia o codigo ASCII do backspace e do delete
<<<<<<< HEAD
    $('#msg').on('keydown', function (event) {
        if (event.which === 8 || event.which === 46) {
            socket.emit('msgappend', {
                'data': event.which,
                'pos': $("#msg").getCursorPosition()
            });
        }
    });

    // envia o codigo ASCII das teclas carregadas
    $('#msg').on('keypress', function (event) {
        socket.emit('msgappend', {
            'data': event.which,
            'pos': $("#msg").getCursorPosition()
        });
    });
=======
//    $('#msg').on('keydown', function (event) {
//        if (event.which === 8 ||
//                event.which === 46) {
//            socket.emit('msgappend', {
//                'data': event.which,
//                'pos': $("#msg").getCursorPosition()
//            });
//        }
//    });

    // envia o codigo ASCII das teclas carregadas
//    $('#msg').on('keypress', function (event) {
//        if (event.which !== 46 && event.which !== 110 && event.which !== 190) {
//            socket.emit('msgappend', {
//                'data': event.which,
//                'pos': $("#msg").getCursorPosition()
//            });
//        }
//    });

    // envia o codigo ASCII das teclas carregadas
//    $('#msg').on('keydown keypress', function (event) {
//        if (event.which === 110 && event.type !== 'keydown') {
//            socket.emit('msgappend', {
//                'data': "abc",
//                'pos': $("#msg").getCursorPosition()
//            });
//        }
//        if ((event.which === 110 || event.which === 190) &&
//                event.type === 'keydown') {
//            socket.emit('msgappend', {
//                'data': "ponto",
//                'pos': $("#msg").getCursorPosition()
//            });
//        }
//    });
>>>>>>> 07753fb9b7673242ff1934b797da2f360c20a283

    // *******************************************************************
    // dados recebidos pelo socket para o browser
    // *******************************************************************
    // recebe o codigo ASCII da tecla recebida, converte-a para 
    // carater e adiciona-o na posicao coreta
<<<<<<< HEAD
    socket.on('msgappend', function (data) {
        var posactual = $("#msg").getCursorPosition();
        var str = $("#msg").val();
        var str1 = "";
        if (data.data === 8 /* backspace*/
                || data.data === 46 /* delete */) {
            if (data.data === 8) {
                if (data.pos > 0) {
                    str1 = str.slice(0, data.pos - 1) + str.slice(data.pos);
                } else {
                    str1 = str.slice(data.pos);
                }
            } else if (data.data === 46) {
                str1 = str.slice(0, data.pos) + str.slice(data.pos + 1);
            }
        } else {
            str1 = [str.slice(0, data.pos), String.fromCharCode(data.data), str.slice(data.pos)].join('');
        }
        $('#msg').val(str1);
        if (posactual < data.pos) {
            $('#msg').selectRange(posactual);
        } else {
            $('#msg').selectRange(posactual - 1);
        }
    });
=======
//    socket.on('msgappend', function (data) {
//        var posactual = $("#msg").getCursorPosition();
//        var str = $("#msg").val();
//        var str1 = "";
//        if (data.data === 8 /* backspace*/
//                || data.data === 46 /* delete */) {
//            if (data.data === 8) {
//                if (data.pos > 0) {
//                    str1 = str.slice(0, data.pos - 1) + str.slice(data.pos);
//                } else {
//                    str1 = str.slice(data.pos);
//                }
//            } else if (data.data === 46) {
//                str1 = str.slice(0, data.pos) + str.slice(data.pos + 1);
//            }
//            $('#msg').val(str1);
//            if (posactual < data.pos) {
//                $('#msg').selectRange(posactual);
//            } else {
//                $('#msg').selectRange(posactual - 1);
//            }
//        } else {
//            if (data.data === "ponto") {
//                str1 = [str.slice(0, data.pos), String.fromCharCode(46), str.slice(data.pos)].join('');
//            } else if (data.data === "abc") {
//                str1 = [str.slice(0, data.pos), String.fromCharCode(110), str.slice(data.pos)].join('');
//            } else {
//                str1 = [str.slice(0, data.pos), String.fromCharCode(data.data), str.slice(data.pos)].join('');
//            }
//            $('#msg').val(str1);
//            if (posactual < data.pos) {
//                $('#msg').selectRange(posactual);
//            } else {
//                $('#msg').selectRange(posactual + 1);
//            }
//
//        }
//    });
>>>>>>> 07753fb9b7673242ff1934b797da2f360c20a283

    // recebe as cordenadas dos outros utilizadores e movimenta a label dele 
    // conforme as coordenadas recebidas 
//    socket.on('mouseMove', function (data, port, socketid) {
//        if (data.user !== "") {
//            if (typeof users[socketid] === "undefined") {
//                $("body").append(
//                        '<div id="' +
//                        socketid +
//                        '" class="div-main ' +
//                        socketid +
//                        '"><p class="name-user"></p></div>');
//                users[socketid] = new Client($("#" + socketid), data.user, port, socketid);
//                $("#listaUsers").append(
//                        "<p class='" +
//                        socketid +
//                        "'><img class='imguser' src='./img/user.png'>" +
//                        data.user +
//                        "</p>");
//                users[socketid].setName(data.user);
//            } else {
//                users[socketid].setSocketId(socketid);
//                users[socketid].setPosition(data.x, data.y);
//            }
//        }
//    });

    // devolve para o servidor de todo o texto da textarea e da 
    // posicao do mouse
//    socket.on("requestOldText", function () {
//        socket.emit('returnOldText', {
//            data: $("#msg").val()
//        });
//        socket.emit('mouseMove', {
//            'user': username,
//            'x': 0,
//            'y': 0
//        });
//    });

    // atualiza a textarea com o texto ja existente na textarea dos 
    // outro utilizadores
//    socket.on("returnOldText", function (data) {
//        $("#msg").html("");
//        $("#msg").val(data.data);
//    });

    // Apaga a informacao referente ao utilizador que se desconectou
//    socket.on('diconnected', function (socketid) {
//        for (var item in users) {
//            if (users[item].getSocketId() === socketid) {
//                var numid = users[item].getdivid();
//                users.splice(users[item], 1);
//                $("." + numid).remove();
//            }
//        }
//    });

    $('#mag').keyup(function (event) {
        // grab text for sending as a message to collaborate
        var sharedtext = $('#msg').html();
        //alert(sharedtext)
        if (TogetherJS.running) {
            TogetherJS.send({
                type: "text-send",
                output: sharedtext
            });
            console.log(sharedtext);
        }
    });

    TogetherJS.hub.on("text-send", function (msg) {
        if (!msg.sameUrl) {
            return;
        }
        $('#msg').html(msg.output);
        console.log(msg.output);
    });

});

$(window).resize(function () {
    // Atribui a largura da textarea
    $("#msg").css({
        width: $(window).width() * 0.68,
        height: $(window).height() * 0.75
    });
    $("#contentorListaUsers").css({
        width: $(window).width() * 0.23,
        height: $("#msg").height()
    });
});
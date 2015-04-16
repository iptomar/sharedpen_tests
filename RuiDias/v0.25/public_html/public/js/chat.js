var users = [];
var numUsers = 0;
var socket = "";
var username = "";

$(document).ready(function () {
    // cria a ligação com o servidor que disponibiliza o socket
    socket = io.connect(window.location.href);

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
                display: "block"
            });
            $("#atualuser").html(
                    "Utilizador atual <u><i><b>" +
                    username +
                    "</b></i></u>");
            // envia o nome do utilizdore a posicao do mouse
            socket.emit('mouseMove', {
                'user': username,
                'x': 10000,
                'y': 10000
            });
            // envia ao servidor o pedido do texto que os outros
            // utilizadores possuem na textarea
            socket.emit("textExist");
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

    $("#contentor").css({
        height: $(window).height() * 0.84
    });
    $("#msg").css({
        height: $("#contentor").height() * 0.94
    });


    // *******************************************************************
    // dados enviadas pelo socket para o servidor
    // *******************************************************************
    // evia as cordenados do ponteiro do rato e do nome do utilizador
    $(window).on("mousemove", function (event) {
        socket.emit('mouseMove', {
            'user': username,
            'x': event.pageX,
            'y': event.pageY
        });
    });

    // envia o codigo ASCII do backspace e do delete
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

    // *******************************************************************
    // dados recebidos pelo socket para o browser
    // *******************************************************************
    // recebe o codigo ASCII da tecla recebida, converte-a para
    // carater e adiciona-o na posicao coreta
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

    // recebe as cordenadas dos outros utilizadores e movimenta a label dele
    // conforme as coordenadas recebidas
    socket.on('mouseMove', function (data, port, socketid) {
        if (data.user !== "") {
            if (typeof users[socketid] === "undefined") {
//                $("body").append(
//                        '<div id="' +
//                        socketid +
//                        '" class="div-main ' +
//                        socketid +
//                        '"><p class="name-user"></p></div>');
                users[socketid] = new Client($("#" + socketid), data.user, port, socketid);
                $("#listaUsers").append(
                        "<p class='" +
                        socketid +
                        "'><img class='imguser' src='./img/user.png'>" +
                        data.user +
                        "</p>");
                users[socketid].setName(data.user);
            } else {
                users[socketid].setSocketId(socketid);
                users[socketid].setPosition(data.x, data.y);
            }
        }
    });

    // devolve para o servidor de todo o texto da textarea e da
    // posicao do mouse
    socket.on("requestOldText", function () {
        socket.emit('returnOldText', {
            data: $("#msg").val()
        });
        socket.emit('mouseMove', {
            'user': username,
            'x': 0,
            'y': 0
        });
    });

    // atualiza a textarea com o texto ja existente na textarea dos
    // outro utilizadores
    socket.on("returnOldText", function (data) {
        $("#msg").html("");
        $("#msg").val(data.data);
    });

    // Apaga a informacao referente ao utilizador que se desconectou
    socket.on('diconnected', function (socketid) {
        for (var item in users) {
            if (users[item].getSocketId() === socketid) {
                var numid = users[item].getdivid();
                users.splice(users[item], 1);
                $("." + numid).remove();
            }
        }
    });

    //Para Chat
    socket.on('message', function (data) {
        $('#panelChat').append(data.user + " : " + data.data + '\n');
        $('#panelChat').animate({
            scrollTop: $('#panelChat').prop("scrollHeight")
        }, 500);
    });

    $('#btnSendChat').click(function () {
        var chatMessage = $('#msgChat').val();
        //limpa input
        $('#msgChat').val('');
        if (chatMessage !== "")
            socket.emit('message', {
                'data': chatMessage,
                'user': username
            });
    });

    $('#msgChat').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#btnSendChat').click();
        }
    });
});

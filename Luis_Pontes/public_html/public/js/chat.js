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
                "visibility": "visible"
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

/*    // Atribui a largura da textarea
    $("#msg").css({
        width: $(window).width() * 0.68,
        height: $(window).height() * 0.75
    });
    $("#contentorListaUsers").css({
        width: $(window).width() * 0.23,
        height: $("#msg").height()
    });*/

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
                $("body").append(
                        '<div id="' +
                        socketid +
                        '" class="div-main ' +
                        socketid +
                        '"><p class="name-user"></p></div>');
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


 // *******************************************************************
 // funçao que cria o pdf butao "Pre-visualizacao"
// *******************************************************************

$('#bt_Pvisua').click(function () {
    
 var x =  $('#msg').val();
     var aux="";
    var cont = 40;
    var l=0;
    var i=0;
    
      var Titulo = prompt('Qual o titulo?');
       
       
        var doc = new jsPDF();
        doc.setFontSize(22);	
        doc.text(20, 20,  Titulo);
    
  /* for(var i = 0; i <= x.length; i ++) {
     aux = aux + x.charAt(i);
         
       doc.text(20, 30, aux)
       if(i==cont){
           aux="";
            for(var i = cont*2; i <= x.length; i ++) {
                 aux = aux + x.charAt(i);
                    doc.text(20, 40, aux); 
            }
           cont = cont*2;
       }
    }*/
    
    while( i <= x.length){
        
                for(i; i <= cont; i ++) {
                    aux = aux + x.charAt(i);
                } 
      
        doc.text(20, 30+(l*10), aux); 
        l=l+1;
        cont = cont*2;
        
                    
    }

       /* for(var i = 1; i <= 12; i ++) {
             for(var i = 1; i <= 12; i ++) {
                 doc.text(20, 30 + (i * 10), x);  // doc.text(x, y, 'conteudo');
             }
        }*/

       /* doc.addPage();
        doc.setFontSize(22);
        doc.text(20, 20, 'Answers');
        doc.setFontSize(16);

        for(var i = 1; i <= 12; i ++) {
            doc.text(20, 30 + (i * 10), i + ' x ' + multiplier + ' = ' + (i * multiplier));
        }	*/
       
     /* alert("O conteudo:" + x);
			var doc = new jsPDF();
			doc.text(20, 20, x);
			//doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
			//doc.addPage();
			//doc.text(20, 20, 'Do you like that?');
			
			// Output as Data URI
			//var pdf = doc.output('datauri');*/
    
     socket.emit('pdf', {'pdf':doc.output('datauri')});
            });
            
			
});		


/*$(window).resize(function () {
    // Atribui a largura da textarea
    $("#msg").css({
        width: $(window).width() * 0.68,
        height: $(window).height() * 0.75
    });
    $("#contentorListaUsers").css({
        width: $(window).width() * 0.23,
        height: $("#msg").height() * 50
    });
    $("#contentorChat").css({
        width: $(window).width() * 0.23,
        height: $("#msg").height()
    });
});*/
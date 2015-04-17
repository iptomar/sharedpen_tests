    var users = [];
    var numUsers = 0;
    var socket = "";
    var username = "";

    var tabsID = [];
    var tabsTxt = [];

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
            //socket.emit("textExist");

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
        
        
            // Recebe as Tabs quando se connecta
              socket.on('Tabs', function (data) {
                tabsID=data.id;
                tabsTxt=data.txt;
                actulizaTabs () ;
              });      

        
              function actulizaTabs () {
                  alert();
                  for (i=0; i < tabsID.length; i++) {          
                      var idd="#"+ Addtab();   
                    $(idd).val( tabsTxt[i] );    
                  }
              };
        
        

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
        $(document.body).on('keydown','.txtTab', function (event) {
          if (event.which === 8 || event.which === 46) {
            socket.emit('msgappend', {
              'data': event.which,
              'pos': $("#"+$(this).attr('id')).getCursorPosition(),
              'id' : "#"+$(this).attr('id')
            });
          }
        });

        // envia o codigo ASCII das teclas carregadas
        $(document.body).on('keypress','.txtTab', function (event) {
          socket.emit('msgappend', {
            'char': event.which,
            'pos': $("#"+$(this).attr('id')).getCursorPosition(),
            'id' : "#"+$(this).attr('id')
          });
        });

        // *******************************************************************
        // dados recebidos pelo socket para o browser
        // *******************************************************************
        // recebe o codigo ASCII da tecla recebida, converte-a para
        // carater e adiciona-o na posicao coreta
        socket.on('msgappend', function (data) {
                  
          var id= data.id;
          var posactual = $(id).getCursorPosition();
          var str = $(id).val();
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
            $(id).val(str1);
            if (posactual < data.pos) {
              $(id).selectRange(posactual);
            } else {
              $(id).selectRange(posactual - 1);
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
                for (i=0; i < tabsID.length; i++) {   
                     tabsTxt[i] = $("#"+tabsID[i]).val();
                  }         
                socket.emit('returnOldText', {
                    id: tabsID,  
                    data: tabsTxt             
                });    
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

                 socket.on("TabsChanged", function (data) {
                     
                    if ($.trim(username) !== "") {
                      if(data.op == "remover"){
                          removeTab(data.id);
                      }else{
                          Addtab();
                      }
                    }
                     
              });





        function Addtab(){

                // Conta quantos <li>(separadores) há (menos 1 por causa do separador "+ Pág")
               tabsID.length = ($('ul#tabs li').length) - 1; 

                // Adiciona um separador antes do último (linha <li></li> antes do last-child)
                $('ul#tabs li:last-child').before('<li id="li' + (tabsID.length + 1) + '"><a href="#page' + (tabsID.length + 1) + '" role="tab" data-toggle="tab">Página ' + (tabsID.length + 1) + ' <button type="button" id='+(tabsID.length + 1)+' class="btn btn-warning btn-xs xtab"><span>x</span></button></a>');

                // Adiciona a página depois da última página (<div></div> markup after the last-child of the <div class="tab-content">)
                $('div.tab-content div:last-child').after('<div class="tab-pane fade" id="page' + (tabsID.length + 1) + '"><textarea class="txtTab form-control" id="msg' + (tabsID.length + 1) + '" rows=15></textarea></div>');

            return tabsID[tabsID.length] ="msg" + (tabsID.length + 1);
        }


            $(function () {

            // Evento "click" no separador "+ Pág."
            $('#tabs a[href="#add-page"]').on('click', function () { 
                // Conta quantos <li>(separadores) há (menos 1 por causa do separador "+ Pág")
                Addtab();        

                $("li-last").attr('class','false');

                
                socket.emit('TabsChanged', {
                //remover ou adicionar
                    op: "adicionar",  
                //id
                    id: tabsID[tabsID.length]   
                });   
                
             });
        });



        $(document.body).on('click','.xtab', function (event) {
           liElem = $(this).attr('id');
            if (confirm("Tem a certeza que quer apagar?")) { // Mostra "Tem a certeza que quer apagar?" e espera que se carregue em "Ok"
                    removeTab(liElem);			
                        socket.emit('TabsChanged', {
                //remover ou adicionar
                    op: "remover",  
                //id
                    id: liElem          
                });   
            }	
            return false;

        });               

        function removeTab(liElem) { // Função que remove separador com o numero de <li>

            $('ul#tabs > li#li' + liElem).fadeOut(1000, function () { 
                $(this).remove(); // Apaga o <li></li>(separador) com um efeito fadeout
            });
            // Também apaga o <div>(página) correta dentro de <div class="tab-content">
            $('div.tab-content div#page' + liElem).remove();                   
            
            // Seleciona todos os <li> excepto o último (que é o "+ Pág.") e sem o que foi apagado
            $('ul#tabs > li').not('#last').not('#li' + liElem).each(function(i){ 
                
            // Obtém-se o atributo <li> div
			var getAttr = $(this).attr('id').split('li'); 
            // We change the div attribute of all <li>: the first is 1, then 2, then 3...    
			$('ul#tabs li#li' + getAttr[1]).attr('id', 'li' + (i + 1)); 
			
			var tabContent = 'Página ' + (i + 1); // 
                tabContent += ' <button type="button" class="btn btn-warning btn-xs xtab" id='+(tabsID.length + 1)+'><span >x</span></button>';
            // tabContent variable, inside the <li>. We change the number also, 1, then 2, then3...
			$('#tabs a[href="#page' + getAttr[1] + '"]').html(tabContent).attr('href', '#page' + (i + 1)); 
            // We do the same for all <div> from <div class="tab-content">: we change the number: 1, then 2, then 3...    
			$('div.tab-content div#page' + getAttr[1]).html('<textarea class="form-control" id="msg' + (i + 1) + '" rows=15>').attr('id', 'page' + (i + 1))}); 
													  
            
            
            
            
            
            


           delete tabsID[tabsID.indexOf("msg"+liElem)];

    }


              //Para Chat -----------------------
              socket.on('message', function (data) {
                $('#panelChat').append(data.user +": "+ data.data + '\n');
                $('#panelChat').animate({scrollTop: $('#panelChat').prop("scrollHeight")}, 500);
              });

              $('#btnSendChat').click(function() {
                var chatMessage = $('#msgChat').val();
                //limpa input
                $('#msgChat').val('');
                if(chatMessage != "")
                  socket.emit('message', {
                    'data': chatMessage,
                    'user': username});
                });


              });

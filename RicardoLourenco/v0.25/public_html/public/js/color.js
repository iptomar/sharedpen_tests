
$(document).ready(function () {
    // cria a ligação com o servidor que disponibiliza o socket
    socket = io.connect(window.location.href);

  
     socket.on('message', function (data) {
        $("body").css("background-color", data.cor); //edit, body must be in quotes!
    });   

    $("#btnok").click(function() {
        var color;
        if ($("#colorpicker").val() == 1){
               color = "white";
        }else if ($("#colorpicker").val() == 2){
               color = "red";
        }else if ($("#colorpicker").val() == 3){
               color = "yellow";
        }else if ($("#colorpicker").val() == 4){
               color = "blue";
        }else if ($("#colorpicker").val() == 5){
               color = "pink";
        }else if ($("#colorpicker").val() == 6){
               color = "green";
        }
        
        socket.emit('message', {
            cor: color
        });     
    });
});








var listaColor = [
    ["default", "Default"],
    ["white", "Branco"],
    ["red", "Vermelho"],
    ["yellow", "Amarelo"],
    ["blue", "Azul"],
    ["pink", "Rosa"],
    ["green", "Verde"]
];

$(document).ready(function () {
    // cria a ligação com o servidor que disponibiliza o socket
    socket = io.connect(window.location.href);

    $('#colorpicker').addAllColors(listaColor);


    socket.on('getcolor', function (data) {
        if (data.cor === "default") {
            alert("sem cor");
        } else {
            $("body").css("background-color", data.cor);
        }
        $("#colorpicker").val(data.cor);
    });

    $("#colorpicker").change(function () {
        socket.emit('setcolor', {
            cor: $(this).find('option:selected').val()
        });
    });

    $("#btnok").click(function () {
        socket.emit('setcolor', {
            cor: $(this).find('option:selected').val()
        });
    });
});

$.fn.addAllColors = function (lista) {
    for (var i = 0, max = lista.length; i < max; i++) {
        $(this).append('<option value="' +
                lista[i][0] + '" style="background:' + lista[i][0] + '">' +
                lista[i][1] + '</option>');
    }
};

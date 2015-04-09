$(document).ready(function () {
    // cria a ligação com o servidor que disponibiliza o socket
    var socket = io.connect(window.location.href);

    // Atribui a largura da textarea
    $("#msg").css({
        width: $(window).width() * 0.98,
        height: 200,
        border: "1px solid black"
    });

    // dados enviadas pelo socket para o servidor

    $('#msg').on('keydown', function (event) {
        if (event.which === 8 || event.which === 46) {
            socket.emit('msgappend', {
                'data': event.which,
                'pos': getCaretCharacterOffsetWithin(document.getElementById("msg"))//($('#msg').prop("selectionStart"))
            });
        }
    });

    $('#msg').on('keypress', function (event) {
        socket.emit('msgappend', {
            'data': event.which,
            'pos': getCaretCharacterOffsetWithin(document.getElementById("msg"))//($('#msg').prop("selectionStart"))
        });
    });

    // dados recebidos pelo socket para o browser
    socket.on('msgappend', function (data) {
        if (data.data === 8 /* backspace*/ || data.data === 46 /* delete */) {
            var posactual = $('#msg').prop("selectionStart");
            var str = $("#msg").val();
            var str1 = "";
            if (data.data === 8) {
                str1 = str.slice(0, data.pos - 1) + str.slice(data.pos);
            } else if (data.data === 46) {
                str1 = str.slice(0, data.pos) + str.slice(data.pos + 1);
            }
            $('#msg').val(str1);
            if (posactual < data.pos) {
                $('#msg').selectRange(posactual); // set cursor position
            } else {
                $('#msg').selectRange(posactual - 1);
            }
        } else {
            var position = data.pos, txt = String.fromCharCode(data.data);
            var current = $("#msg").html();
            $("#msg").html([current.slice(0, position), txt, current.slice(position)].join(''));
        }
    });
});

$.fn.selectRange = function (start, end) {
    if (!end)
        end = start;
    return this.each(function () {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};
//$('#elem').selectRange(3, 5); // select a range of text
//$('#elem').selectRange(3); // set cursor position

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

//function appendAtCaret($target, caret, $value) {
//    var value = $target.val();
//    if (caret != value.length) {
//        var startPos = $target.prop("selectionStart");
//        var scrollTop = $target.scrollTop;
//        $target.append(value.substring(0, caret) + $value + value.substring(caret, value.length));
//        $target.prop("selectionStart", startPos + $value.length);
//        $target.prop("selectionEnd", startPos + $value.length);
//        $target.scrollTop = scrollTop;
//    } else if (caret === 0) {
//        $target.append($value + value);
//    } else {
//        $target.append(value + $value);
//    }
//}

//function Iniciar() {
//    $('#msg').document.designMode = 'On';
//}
//
//function recortar() {
//    $('#msg').document.execCommand('cut', false, null);
//}
//
//function copiar() {
//    $('#msg').document.execCommand('copy', false, null);
//}
//
//function colar() {
//    $('#msg').document.execCommand('paste', false, null);
//}
//
//function desfazer() {
//    $('#msg').document.execCommand('undo', false, null);
//}
//
//function refazer() {
//    $('#msg').document.execCommand('redo', false, null);
//}
//
//function negrito() {
//    $('#msg').document.execCommand('bold', false, null);
//}
//
//function italico() {
//    $('#msg').document.execCommand('italic', false, null);
//}
//
//function sublinhado() {
//    $('#msg').document.execCommand('underline', false, null);
//}
//
//function alinharEsquerda() {
//    $('#msg').document.execCommand('justifyleft', false, null);
//}
//
//function centralizado() {
//    $('#msg').document.execCommand('justifycenter', false, null);
//}
//
//function alinharDireita() {
//    $('#msg').document.execCommand('justifyright', false, null);
//}
//
//function numeracao() {
//    $('#msg').document.execCommand('insertorderedlist', false, null);
//}
//
//function marcadores() {
//    $('#msg').document.execCommand('insertunorderedlist', false, null);
//}
//
//function fonte(fonte) {
//    if (fonte != '') {
//        $('#msg').document.execCommand('fontname', false, fonte);
//    }
//}
//
//function tamanho(tamanho) {
//    if (tamanho != '') {
//        $('#msg').document.execCommand('fontsize', false, tamanho);
//    }
//}

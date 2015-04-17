// devolve a posicao do cursor no elemento invocado
$.fn.getCursorPosition = function () {
    var el = $(this).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
    } else if ('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
};

/**
 * coloca o curso na posicao especificada
 * @param {type} start Posicao inicial
 * @param {type} end posicao final
 * @returns {$.fn@call;each}
 */
//$('#elem').selectRange(3, 5); // select a range of text
//$('#elem').selectRange(3); // set cursor position
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

/**
 * Faz o calculo para de uma cor em RGB 
 * @param {type} hex
 * @param {type} s
 * @param {type} n
 * @returns {String}
 */
function hexToRgb(hex, s, n) {
    for (var i = 0, max = s.length; i < max; i++) {
        hex += s[i].charCodeAt(0);
    }
    for (var i = 0, max = n.length; i < max; i++) {
        hex += n[i].charCodeAt(0);
    }
    var bigint = parseInt(hex.toString(16), 16);
    var r = ((bigint >> 16) & 255);
    var g = (bigint >> 8) & 255;
    var b = (bigint & 255);

    return r + "," + g + "," + b;
}




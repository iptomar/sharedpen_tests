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


// --------------------  SEPARADORES  -----------------------



//function removeTab(liElem) { // Função que remove separador com o numero de <li>
//	if (confirm("Tem a certeza que quer apagar?")) { // Mostra "Tem a certeza que quer apagar?" e espera que se carregue em "Ok"
//        
//		$('ul#tabs > li#li' + liElem).fadeOut(1000, function () { 
//			$(this).remove(); // Apaga o <li></li>(separador) com um efeito fadeout
//		});
//		// Também apaga o <div>(página) correta dentro de <div class="tab-content">
//		$('div.tab-content div#page' + liElem).remove(); 
//		
//		/*$('ul#tabs > li').not('#last').not('#li' + liElem).each(function(i){ // Seleciona todos os <li> excepto o último (que é o "+ Pág.") e sem o que foi apagado
//			var getAttr = $(this).attr('id').split('li'); // Obtém-se o atributo <li> div
//			$('ul#tabs li#li' + getAttr[1]).attr('id', 'li' + (i + 1)); // We change the div attribute of all <li>: the first is 1, then 2, then 3...
//			
//			var tabContent = 'Página ' + (i + 1); // 
//			if (getAttr[1] != 1) tabContent += ' <button type="button" class="btn btn-warning btn-xs" onclick="removeTab(' + (i + 1) + ');"><span >x</span></button>';
//			$('#tabs a[href="#page' + getAttr[1] + '"]').html(tabContent) // tabContent variable, inside the <li>. We change the number also, 1, then 2, then3...
//														.attr('href', '#page' + (i + 1)); // Same for the href attribute
//			
//			$('div.tab-content div#page' + getAttr[1]).html('<textarea class="form-control" id="msg' + (i + 1) + '" rows=15>') // We do the same for all <div> from <div class="tab-content">: we change the number: 1, then 2, then 3...
//													  .attr('id', 'page' + (i + 1))}); // Same for the id attribute
//													  */
//
//        ;
//       delete tabsID[tabsID.indexOf("msg"+liElem)];
//	}	
//	return false;
//}
// -----------------  FIM SEPARADORES  -----------------------
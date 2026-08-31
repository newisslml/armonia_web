jQuery(document).ready(function($){

    // Buscador: sugerencias en vivo (categorías + productos que calzan con lo escrito)
    (function(){
        var $input = $('#armonia_search_input');
        var $box = $('#armonia_search_suggestions');
        if ( !$input.length || !$box.length || typeof ArmoniaBuscador === 'undefined' ) return;

        var timer = null;
        var activeIndex = -1;

        function cerrar(){
            $box.attr('hidden', true).empty();
            activeIndex = -1;
        }

        function pintar(items){
            if ( !items || !items.length ) { cerrar(); return; }
            var html = '';
            items.forEach(function(item){
                if ( item.tipo === 'categoria' ) {
                    html += '<a href="' + item.url + '" class="suggestion-categoria">Ver categoría: ' + item.texto + '</a>';
                } else {
                    html += '<a href="' + item.url + '"><span>' + item.texto + '</span><span class="precio">' + (item.precio || '') + '</span></a>';
                }
            });
            $box.html(html).attr('hidden', false);
            activeIndex = -1;
        }

        $input.on('input', function(){
            var term = $input.val().trim();
            clearTimeout(timer);
            if ( term.length < 2 ) { cerrar(); return; }
            timer = setTimeout(function(){
                $.getJSON(ArmoniaBuscador.ajax_url, { action: 'armonia_buscador_sugerencias', term: term }, pintar);
            }, 300);
        });

        $input.on('keydown', function(e){
            var $links = $box.find('a');
            if ( !$links.length ) return;
            if ( e.key === 'ArrowDown' ) {
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, $links.length - 1);
            } else if ( e.key === 'ArrowUp' ) {
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
            } else if ( e.key === 'Enter' && activeIndex > -1 ) {
                e.preventDefault();
                window.location.href = $links.eq(activeIndex).attr('href');
                return;
            } else if ( e.key === 'Escape' ) {
                cerrar();
                return;
            } else {
                return;
            }
            $links.removeClass('is-active').eq(activeIndex).addClass('is-active');
        });

        $(document).on('click', function(e){
            if ( !$(e.target).closest('.search_box').length ) cerrar();
        });
    })();

    $('#slider_home .slider_in').bxSlider({
        mode: 'fade', //horizontal', 'vertical', 'fade'
        infiniteLoop: 'true', //true, false
        pager:false, // Puntos
        controls: true, // Flechas
        auto:true,
        adaptiveHeight: true,
        touchEnabled: false,

		onSliderLoad: function(){
            $(this).css("display", "block");
        },
		onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
        },
		onSlideBefore: function () {
        },

    });

    $('.shipping-calculator-button').addClass('button');

});

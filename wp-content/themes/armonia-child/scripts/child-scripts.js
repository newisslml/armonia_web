jQuery(document).ready(function($){

    $('#slider_home .slider_in').bxSlider({
        //pagerCustom: '#tecnologia_botones', //mode debe estar en fade
        mode: 'fade', //horizontal', 'vertical', 'fade'
        infiniteLoop: 'true', //true, false
        pager:false, // Puntos
        controls: true, // Flechas
        auto:true,
        adaptiveHeight: true,
        touchEnabled: false,
        
        //
		onSliderLoad: function(){
            $(this).css("display", "block");
            //gsap.from('#slider_home .h1',{duration: 3, opacity: 1, y:-100 });
        },
		onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            //gsap.from('#slider_home .h1',{duration: 3, opacity: 1, y:-100 });
        },
		onSlideBefore: function () {
            //gsap.from('#slider_home .h1',{duration: 3, opacity: 1, y:-100 });
        },
        
    }); 

});
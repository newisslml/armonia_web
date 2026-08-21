jQuery(document).ready(function($){
    
    $('.woocommerce-MyAccount-navigation').prepend('<div class="h3 myaccount_title">Tu cuenta<hr></div>');
    
    $('button[name="btn_filtro"]').on('click',function(){
        $('.boxes').toggleClass('active');
    });
    
    $('.img_gallery a').attr('data-fancybox','galeria');
    

    
    
});
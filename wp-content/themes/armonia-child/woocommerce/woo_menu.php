<div id="woo_menu">
    <?php echo do_shortcode('[woo_cart_but]'); ?>
    <a href="<?php echo get_permalink( get_option('woocommerce_myaccount_page_id') ); ?>" class="woo_btn account" id="account_btn" title="Mi cuenta">
        
        <div class="woo_btn_in">
            <div class="icono"></div>
            <div class="texto">Mi cuenta</div>
        </div>
        
    </a>
</div>
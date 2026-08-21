<?php
/**
 * The Template for displaying all single products
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see         https://docs.woocommerce.com/document/template-structure/
 * @package     WooCommerce/Templates
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_header( 'shop' ); ?>
<div id="single_product" class="woocommerce opacity">  
<?php woocommerce_output_content_wrapper(); ?> 
 
  
    
    
<section class="prebar"><div class="wrap"> 
    <?php woocommerce_output_all_notices(); ?>
</div></section>  
 

    
    
<section class="ficha"><div class="wrap">
   
    <div class="wrap_col">
        <div class="img_principal">
        <?php woocommerce_show_product_sale_flash(); ?>
        <a data-fancybox='galeria' href="<?php the_post_thumbnail_url('large'); ?>" style="background-image:url(<?php the_post_thumbnail_url('large'); ?>);"></a>
        </div>
        <div class="img_gallery">
        <?php do_action( 'woocommerce_product_thumbnails' ); ?>
        </div>
    </div>
  
   
    <div class="wrap_col">
        
        
        <?php woocommerce_breadcrumb('') ?>
        <hr>
        <?php woocommerce_template_single_title(); ?>
        <!-- 2 <?php woocommerce_template_single_rating(); ?> -->
        <?php woocommerce_template_single_price(); ?>
        <?php woocommerce_template_single_excerpt(); ?>
        <!-- <?php woocommerce_template_single_meta(); ?> -->
        <?php woocommerce_template_single_sharing(); ?>
       
        <?php woocommerce_template_single_add_to_cart(); ?>

        <?php if ( get_the_content() ) { ?>
        <div class="pre_formated_content descripcion_producto"><?php the_content(); ?></div>
        <?php } ?>

    </div>



</div></section>


<section class="relacionados"><div class="wrap">
    <?php echo do_shortcode('[related_products limit="5" order="rand"]'); ?>    
</div></section>
    
   
   
<?php woocommerce_output_content_wrapper_end(); ?>    
</div>
<script>
jQuery(document).ready(function($){  
    $('section.products').removeClass('products');
    $('.woocommerce-product-gallery__image a').attr('data-fancybox','galeria')
});
</script>

<?php
get_footer( 'shop' );

/* Omit closing PHP tag at the end of PHP files to avoid "headers already sent" issues. */

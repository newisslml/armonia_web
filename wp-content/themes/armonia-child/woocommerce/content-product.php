<?php
/**
 * The template for displaying product content within loops
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.6.0
 */

defined( 'ABSPATH' ) || exit;

global $product;

// Ensure visibility.
if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}
?>
<li <?php wc_product_class( '', $product ); ?>>
    
    <a href="<?php the_permalink(); ?>" class="foto" >
        
        <?php woocommerce_show_product_sale_flash(); ?>
        <?php echo get_the_post_thumbnail( $product->get_id(), 'thumbnail', array( 'class' => 'fondo' ) ); ?>
        <div class="sobre"></div>
    </a>
    <div class="contenido">
        <!-- <?php global $product;  echo $product->get_categories( ', ', ' ' . _n( ' ', '  ', $cat_count, 'woocommerce' ) . ' ', ' ' ); ?> -->
        <?php $wp_query->get_queried_object()->term_id; ?>
        <a href="<?php the_permalink(); ?>"><?php woocommerce_template_single_title(); ?></a>
        <?php woocommerce_template_single_price(); ?>
        <!--<?php woocommerce_template_single_excerpt(); ?>-->
    </div>
        
    
</li>

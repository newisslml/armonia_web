<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/archive-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.4.0
 */

defined( 'ABSPATH' ) || exit;

get_header( 'shop' ); ?><div class="woocommerce opacity">
<main id="products_page" >



    




<?php
if ( woocommerce_product_loop() ) { ?>
    
    <section class="precontent"><div class="wrap">
        <?php /**
         * Hook: woocommerce_before_main_content.
         *
         * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
         * @hooked woocommerce_breadcrumb - 20
         * @hooked WC_Structured_Data::generate_website_data() - 30
         */
        //do_action( 'woocommerce_before_main_content' ); 
        
        ?>

        

        <?php
        /**
         * Hook: woocommerce_archive_description.
         *
         * @hooked woocommerce_taxonomy_archive_description - 10
         * @hooked woocommerce_product_archive_description - 10
         */
        do_action( 'woocommerce_archive_description' );
        ?>

        <?php /**
         * Hook: woocommerce_before_shop_loop.
         *
         * @hooked woocommerce_output_all_notices - 10
         * @hooked woocommerce_result_count - 20
         * @hooked woocommerce_catalog_ordering - 30
         */
        // do_action( 'woocommerce_before_shop_loop' ); 
        woocommerce_output_all_notices();
        
        ?>
    </div></section>
    
    <section class="preitems"><div class="wrap">
        <div class="wrap_col"><?php woocommerce_breadcrumb(); ?></div>
        <div class="wrap_col filtro_grupo">
            <?php
            // ponytail: dropdown propio (sin el widget de WooCommerce) para que solo liste las
            // categorías de la sección actual — no todo el catálogo — y sin depender de select2.
            $current_term    = is_product_category() ? get_queried_object() : null;
            $top_ancestor_id = 0;
            if ( $current_term ) {
                $ancestors       = get_ancestors( $current_term->term_id, 'product_cat' );
                $top_ancestor_id = $ancestors ? end( $ancestors ) : $current_term->term_id;
            }
            $grupo_terms = get_terms( array(
                'taxonomy'   => 'product_cat',
                'parent'     => $top_ancestor_id,
                'hide_empty' => true,
            ) );
            ?>
            <?php if ( $grupo_terms && ! is_wp_error( $grupo_terms ) ) : ?>
            <select class="dropdown_grupo_actual">
                <option value="<?php echo esc_url( $top_ancestor_id ? get_term_link( $top_ancestor_id, 'product_cat' ) : get_permalink( wc_get_page_id( 'shop' ) ) ); ?>">
                    <?php echo $top_ancestor_id ? 'Ver todo' : 'Selecciona una categoría'; ?>
                </option>
                <?php foreach ( $grupo_terms as $term ) : ?>
                    <option value="<?php echo esc_url( get_term_link( $term ) ); ?>" <?php selected( $current_term && $current_term->term_id === $term->term_id ); ?>>
                        <?php echo esc_html( $term->name ); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <script>
            jQuery(function($){
                $('.dropdown_grupo_actual').on('change', function(){
                    window.location.href = $(this).val();
                });
            });
            </script>
            <?php endif; ?>
        </div>
        <div class="wrap_col"><?php woocommerce_catalog_ordering(); ?></div>
    </div></section>
        
        
    <section class="items"><div class="wrap">
    
        
        <div class="wrap_col">
            
            <?php if ( apply_filters( 'woocommerce_show_page_title', true ) ) : ?>
            <div class="woocommerce-products-header__title page-title cat_title"><?php woocommerce_page_title(); ?></div>
            <?php endif; ?>
            
            
            
            <div class="woo_sidebar">
                <button type="button" name="btn_filtro" class="button"><span>FILTROS</span></button>
                <div class="boxes"><?php dynamic_sidebar( 'woobar' ); ?></div>
                <div class="woobar"><?php dynamic_sidebar( 'widgets' ); ?></div>
            </div>
            
        </div>
    
        
        <div class="wrap_col">
        <?php woocommerce_product_loop_start();

            if ( wc_get_loop_prop( 'total' ) ) {
                while ( have_posts() ) {
                    the_post();

                    /**
                     * Hook: woocommerce_shop_loop.
                     */
                    do_action( 'woocommerce_shop_loop' );

                    wc_get_template_part( 'content', 'product' );
                }
            }

        woocommerce_product_loop_end(); ?>
        </div>
        
        
    </div></section>
    
    
    
	<?php /**
	 * Hook: woocommerce_after_shop_loop.
	 *
	 * @hooked woocommerce_pagination - 10
	 */
	do_action( 'woocommerce_after_shop_loop' ); ?>
	
	
<?php } else { ?>

    <section class="f"><div class="wrap">
    <?php	/**
	 * Hook: woocommerce_no_products_found.
	 *
	 * @hooked wc_no_products_found - 10
	 */
	do_action( 'woocommerce_no_products_found' ); ?>
	</div></section>
	
<?php }

/**
 * Hook: woocommerce_after_main_content.
 *
 * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
 */
do_action( 'woocommerce_after_main_content' );

?>
</main>
<?php get_footer( 'shop' );

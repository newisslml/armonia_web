<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>


<?php query_posts('pagename=informacion-general'); while (have_posts ()): the_post(); ?> 
    	<?php $favicon = get_field('favicon'); ?>
        <link rel="icon" type="image/png" href="<?php echo wp_get_attachment_image_url( $favicon ); ?>" />
<?php endwhile; wp_reset_query(); ?>



<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />


<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta property="og:locale" content="<?php bloginfo('language'); ?>">
<meta property="og:type" content="website">
<?php
// Título/descripción/imagen reales por tipo de página: singular (páginas y productos), home, o archivo de categoría.
if ( is_home() || is_front_page() ) {
    $meta_title = get_bloginfo( 'name' ) . ' | ' . get_bloginfo( 'description' );
    $meta_description = get_field( 'descripcion_del_sitio', 13 );
    if ( ! $meta_description ) {
        $meta_description = get_bloginfo( 'description' );
    }
    $meta_url = home_url( '/' );
    $meta_image = wp_get_attachment_image_url( get_field( 'share_image', 13 ), 'medium-square' );
} elseif ( is_category() || is_tax( 'product_cat' ) || is_shop() ) {
    $term = get_queried_object();
    $meta_title = is_shop() ? get_the_title( wc_get_page_id( 'shop' ) ) : $term->name;
    $meta_description = is_shop() ? '' : term_description( $term->term_id, 'product_cat' );
    if ( $meta_description ) {
        $meta_description = wp_trim_words( wp_strip_all_tags( $meta_description ), 30 );
    } elseif ( is_shop() ) {
        $meta_description = sprintf( 'Descubre todos los productos de %s: amuletos, cristales, inciensos y accesorios espirituales, con despacho a todo Chile.', get_bloginfo( 'name' ) );
    } else {
        $meta_description = sprintf( 'Compra %s online en %s: productos seleccionados, pago seguro y despacho a todo Chile.', $meta_title, get_bloginfo( 'name' ) );
    }
    $meta_url = is_shop() ? get_permalink( wc_get_page_id( 'shop' ) ) : get_term_link( $term );
    $meta_image = ! is_shop() && function_exists( 'wc_get_product_category_thumbnail_id' ) ? wp_get_attachment_image_url( wc_get_product_category_thumbnail_id( $term->term_id ), 'medium-square' ) : false;
} elseif ( is_singular() ) {
    $meta_title = get_the_title();
    $meta_description = get_the_excerpt();
    if ( ! $meta_description ) {
        $meta_description = wp_trim_words( wp_strip_all_tags( get_the_content() ), 30 );
    }
    $meta_url = get_permalink();
    $meta_image = get_the_post_thumbnail_url( get_the_ID(), 'medium-square' );
} else {
    $meta_title = get_the_title();
    $meta_description = get_bloginfo( 'description' );
    $meta_url = home_url( add_query_arg( null, null ) );
    $meta_image = false;
}
if ( ! $meta_image ) {
    $meta_image = wp_get_attachment_image_url( get_field( 'share_image', 13 ), 'medium-square' );
}
$meta_description = trim( preg_replace( '/\s+/', ' ', $meta_description ) );
?>
<meta property="og:title" content="<?php echo esc_attr( $meta_title ); ?>">
<meta property="og:description" content="<?php echo esc_attr( $meta_description ); ?>" />
<meta name="description" content="<?php echo esc_attr( $meta_description ); ?>" />
<meta property="og:url" content="<?php echo esc_url( $meta_url ); ?>">
<meta property="og:site_name" content="<?php bloginfo('name'); ?>"/>
<meta property="og:image" content="<?php echo esc_url( $meta_image ); ?>"/>
<meta property="og:image:width" content="200" />
<meta property="og:image:height" content="200" />
<meta property="fb:app_id" content="<?php the_field('facebook_app_id',13); ?>"/>

 
       
<?php wp_head(); ?>
</head>
<body <?php body_class(''); ?>>
    

<?php if ( is_home() ) { ?>
    <?php query_posts('pagename=popup'); while (have_posts ()): the_post(); if( get_field('activar') ) { ?>
        <div id="popup"><div class="wrap">
            asdads
            <div id="popup_close">
<svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path></svg>
</div>
        </div></div>
    <?php }; endwhile; wp_reset_query(); ?>  
<?php } else { } ?>
    
    
<searchscreen>
   
    <div id="search_close">
        <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path></svg>
    </div>

    <div class="wrap">
        <form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="">
            <input type="search" class="search_field" placeholder="<?php echo esc_attr_x( 'Que buscas?', 'placeholder', 'radiate' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
            <input type="submit" class="search_submit" value="<?php echo esc_attr_x( 'Buscar', 'submit button', 'radiate' ); ?>" >
        </form>
    </div>

</searchscreen>

    
    
<menumobile>

    <div id="nav_mobile" class="nav_mobile" >
        <span class="ln-one"></span>
        <span class="ln-two"></span>
        <span class="ln-three"></span>
    </div>
    
    <div class="menu_class">
        <?php wp_nav_menu( array( 'theme_location' => 'menu_sup', 'menu_class' => 'primary', 'fallback_cb' => '') ); ?>
        <?php include (STYLESHEETPATH.'/woocommerce/woo_menu.php'); ?>
    </div>
        
</menumobile>
    
    


<?php query_posts('pagename=infobar'); while (have_posts ()): the_post(); if( get_field('activar') ) { ?>
<prebar><div class="wrap">
    <?php the_content() ?>
</div></prebar>
<?php }; endwhile; wp_reset_query(); ?>  
   
   
    

<header>
<div class="wrap">        
        
        <?php query_posts('pagename=informacion-general'); while (have_posts ()): the_post(); ?> 
            <a href="<?php bloginfo('url'); ?>" id="logo_top" class="">
                <?php $image = get_field('logo_superior'); $size = 'full'; ?>
                <img alt="<?php bloginfo('title'); ?>" src="<?php echo wp_get_attachment_image_url( $image, $size ); ?>" >
            </a>
        <?php endwhile; wp_reset_query(); ?>   
        
        
        <div id="extra_btns">
        <?php include (STYLESHEETPATH.'/woocommerce/woo_menu.php'); ?>
        <div class="search_btn"></div>
        </div>
        
        
        <div id="nav_mobile" class="nav_mobile" >
            <span class="ln-one"></span>
            <span class="ln-two"></span>
            <span class="ln-three"></span>
        </div>
        
</div>

       
<div class="menu"><div class="wrap">
            
    <div class="menu_class">
        <?php wp_nav_menu( array( 'theme_location' => 'menu_sup', 'menu_class' => 'primary', 'fallback_cb' => '') ); ?>
    </div>

</div></div>   

</header>
    

<div id="pagina">
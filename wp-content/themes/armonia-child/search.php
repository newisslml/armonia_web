<?php get_header(); ?>
<?php if ( have_posts() ) : ?>
<main id="search">
    

<section id="" style=""><div class="wrap" style="padding:10px 0px;">
    
    <div class="h1">Resultados para: <b><?php printf( esc_html__( '%s', 'blankslate' ), get_search_query() ); ?></b></div>
    
</div></section> 
    
<section><div class="wrap" style="padding:0px;"><hr></div></section>



<section id="" style=""><div class="wrap" style="padding:20px 0px;">

    <div class="woocommerce">
        <ul class="products">
        <?php while ( have_posts() ) : the_post(); ?>
            <li <?php wc_product_class( '', $product ); ?>>
    
                <a href="<?php the_permalink(); ?>" class="foto" >

                    <?php woocommerce_show_product_sale_flash(); ?>
                    <div class="fondo" style="background-image:url('<?php the_post_thumbnail_url('thumbnail'); ?>');"></div>
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
        <?php endwhile; ?>
        </ul>
    </div>
    
</div></section> 




<section id="" style=""><div class="wrap" style="border-top:#333 1px solid;">
        
        <div class="h2" style="width:100%; margin-bottom:20px;">¿No es lo que buscabas? Prueba nuevamente</div>

        <div class="search_box" sty><div class="mini_search_form">

                <form role="search" method="get" id="searchform" class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" class="search_field" placeholder="Que buscas?" />
                    <input type="submit" id="searchsubmit" value="<?php echo esc_attr_x( 'Buscar', 'submit button' ); ?>"  />
                </form>

        </div></div>
    
</div></section> 

    

<?php else : ?>
    

<section id="search_not_found"><div class="wrap" style="justify-content:center; text-align:center; padding-top:40px; padding-bottom:0px;">

    <div class="h3">
    <p><?php esc_html_e( 'No encontramos nada que se relacione con tu busqueda. Pero puedes probar denuevo.', 'blankslate' ); ?></p>
    </div>
    
    
</div></section>  


    

<section id="" style=""><div class="wrap" style="justify-content:center; text-align:center; padding-bottom:40px;">
    

<div class="search_box"><div class="mini_search_form">

        <form role="search" method="get" id="searchform" class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
            <input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" class="search_field" placeholder="Que buscas?" />
            <input type="submit" id="searchsubmit" value="<?php echo esc_attr_x( 'Buscar', 'submit button' ); ?>"  />
        </form>
        
</div></div>
    
</div></section> 
    

</main>
<?php endif; ?>
<?php get_footer(); ?>


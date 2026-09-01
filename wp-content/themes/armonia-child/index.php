<?php get_header(); ?>
<?php query_posts('pagename=home'); while (have_posts ()): the_post(); ?> 
<main id="index">
   
   
    
<?php if( have_rows('destacados') ): ?>
<section id="section1" class="">

<div class="slider" id="slider_home">
    <div class="slider_in">

    <?php while ( have_rows('destacados') ) : the_row(); ?>
    
        <?php
        $icono = get_sub_field('fondo');
        // Banner full-width: se sirve el archivo original ('full') en vez del recorte 'large' (~1024px),
        // que en pantallas grandes / retina se ve borroso. Fallback a 'large' si no hubiera original.
        $fondo_url = $icono ? wp_get_attachment_image_url( $icono, 'full' ) : '';
        if ( ! $fondo_url ) { $fondo_url = $icono ? wp_get_attachment_image_url( $icono, 'large' ) : ''; }
        ?>
        <div class="slide" style="background-image:url('<?php echo esc_url( $fondo_url ); ?>'); " >
        <div class="wrap " id="">
            <?php
            $term = get_sub_field('link');
            $texto = get_sub_field('texto');
            $term_link = $term ? get_term_link( $term ) : '';
            $term_url = is_wp_error( $term_link ) ? '#' : esc_url( $term_link ); ?>
            <a class="contenido h1" href="<?php echo $term_url; ?>">
                <div class="titulo"><?php echo $texto ?></div>
                <div class="texto">ver mas</div>
                <div class="arrow">&rang;</div>
            </a>
        </div>
    </div>
    <?php endwhile; ?>
    
    </div>
</div>
     
</section> 
<?php endif; ?>
   
   
   
<?php if( have_rows('banner') ): while ( have_rows('banner') ) : the_row(); ?> 
<section id="section3" class=""><div class="wrap " id="">

        <div class="wrap_col">
            <?php the_sub_field('col_1'); ?>
        </div>

        <div class="wrap_col">
            <?php the_sub_field('col_2'); ?>
        </div>
     
</div></section> 
<?php endwhile; endif; ?>
    
   
   
    

<?php
$nuevos_productos = new WP_Query( array(
    'post_type'      => 'product',
    'posts_per_page' => 8,
    'orderby'        => 'date',
    'order'          => 'DESC',
    /* ponytail: sin esto, productos agotados/ocultos entran a la query pero content-product.php
       los salta en silencio (is_visible() == false), dejando huecos impares en la grilla mobile. */
    'tax_query'      => array(
        array(
            'taxonomy' => 'product_visibility',
            'field'    => 'name',
            'terms'    => array( 'outofstock', 'exclude-from-catalog' ),
            'operator' => 'NOT IN',
        ),
    ),
) );
if ( $nuevos_productos->have_posts() ) : ?>
<section id="section-nuevo"><div class="wrap" id="">
    <div class="titulo_seccion h2">Lo nuevo en la tienda</div>
    <div class="woocommerce">
    <ul class="products">
        <?php while ( $nuevos_productos->have_posts() ) : $nuevos_productos->the_post();
            wc_get_template_part( 'content', 'product' );
        endwhile; ?>
    </ul>
    </div>
</div></section>
<?php endif; wp_reset_postdata(); ?>



<?php if( have_rows('categorias') ): while ( have_rows('categorias') ) : the_row(); ?>
<section id="section2" class=""><div class="wrap " id="">

    <div class="titulo_seccion h2"><?php the_sub_field('titulo'); ?></div>
    
  
<div class="cols">
<?php if( have_rows('list_categorias') ): while ( have_rows('list_categorias') ) : the_row(); ?>

    <?php $image = get_sub_field('fondo'); $size = 'medium-fixed'; ?>
    <div class="col" style="background-image:url('<?php echo wp_get_attachment_image_url( $image, $size ); ?>')">
        <?php
        $term = get_sub_field('seleccione');
        if ( $term && ! is_object( $term ) ) {
            $term = get_term( $term, 'product_cat' );
        }
        if ( $term && ! is_wp_error( $term ) ) : ?>
        <a href="<?php echo esc_url( get_term_link( $term ) ); ?>">
            <h2><?php echo esc_html( $term->name ); ?></h2>
        </a>
        <?php endif; ?>
    </div>

<?php endwhile; endif; ?>
</div>  

     
</div></section> 
<?php endwhile; endif; ?>
   
   
    

  
<section id="instagram">
    
<?php query_posts('pagename=instagram'); while (have_posts ()): the_post(); ?> 
    <div class="titulo_seccion h2"><?php the_field('titulo'); ?></div>
    <?php $usuario = get_field('usuario'); 
    if( function_exists( 'wp_my_instagram') ) wp_my_instagram( array( 'username' => $usuario, 'limit' => 8, 'layout' => '3' ) );
    ?>

<?php endwhile; wp_reset_query(); ?>
</section>
    
    
</main>
<?php endwhile; wp_reset_query(); ?>
<?php get_footer(); ?>


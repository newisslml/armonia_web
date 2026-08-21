<?php get_header(); ?>
<?php query_posts('pagename=home'); while (have_posts ()): the_post(); ?> 
<main id="index">
   
   
    
<?php if( have_rows('destacados') ): ?>
<section id="section1" class="">

<div class="slider" id="slider_home">
    <div class="slider_in">

    <?php while ( have_rows('destacados') ) : the_row(); ?>
    
        <?php $icono = get_sub_field('fondo'); $size = 'large'; ?>
        <div class="slide" style="background-image:url('<?php echo wp_get_attachment_image_url( $icono, $size ); ?>'); " >
        <div class="wrap " id="">
            <?php 
            $term = get_sub_field('link');
            $texto = get_sub_field('texto'); ?>
            <a class="contenido h1" href="<?php echo esc_url( get_term_link( $term ) ); ?>">
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
    
   
   
    

<?php if( have_rows('categorias') ): while ( have_rows('categorias') ) : the_row(); ?>
<section id="section2" class=""><div class="wrap " id="">

    <div class="titulo_seccion h2"><?php the_sub_field('titulo'); ?></div>
    
  
<div class="cols">
<?php if( have_rows('list_categorias') ): while ( have_rows('list_categorias') ) : the_row(); ?>

    <?php $image = get_sub_field('fondo'); $size = 'medium-fixed'; ?>
    <div class="col" style="background-image:url('<?php echo wp_get_attachment_image_url( $image, $size ); ?>')">
        <?php $term = get_sub_field('seleccione'); if( $term ): ?>
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
    if( function_exists( 'wp_my_instagram') ) wp_my_instagram( array( 'username' => $usuario, 'limit' => 8, layout => '3' ) );
    ?>

<?php endwhile; wp_reset_query(); ?>
</section>
    
    
</main>
<?php endwhile; wp_reset_query(); ?>
<?php get_footer(); ?>


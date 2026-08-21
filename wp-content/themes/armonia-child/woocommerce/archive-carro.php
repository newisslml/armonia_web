<?php 

/* Template Name: Carro-Finalizar */

get_header(); ?>
<?php if ( have_posts() ) : ?>
<main id="<?php global $post; $post_slug = $post->post_name; echo $post_slug; ?>">

 
<section class="titulo_carro" ><div class="wrap">

    <div class="h2"><?php the_title(); ?></div>

</div></section>   
    
    
<?php while ( have_posts() ) : the_post(); ?>   
<section id="box_carro" ><div class="wrap">
    
<?php the_content(); ?>

</div></section> 
<?php endwhile; ?>   
   
    
</main>
<?php endif; ?>
<?php get_footer(); ?>
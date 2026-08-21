<?php 

/* Template Name: Mi Cuenta */

get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?> 
<main id="mi_cuenta">
   
   
   
<section id="" ><div class="wrap">
    
<?php the_content(); ?>

</div></section> 
    
   
    
</main>
<?php endwhile; endif; ?>
<?php get_footer(); ?>
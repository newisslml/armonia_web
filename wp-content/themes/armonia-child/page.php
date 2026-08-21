<?php get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?> 
<main id="<?php global $post; $page_slug = $post->post_name; echo $page_slug ?>" class="page">
   
   
   
<section id="" class=""><div class="wrap">
    
    <?php the_content(); ?>
    
</div></section>
    
   
    
</main>
<?php endwhile; endif; ?>
<?php get_footer(); ?>
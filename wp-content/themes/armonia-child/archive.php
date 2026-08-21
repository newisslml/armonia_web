<?php get_header(); ?>
<main id="<?php global $post; $page_slug = $post->post_name; echo $page_slug ?>" class="archive">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?> 
   
   
   
<section id="" class=""><div class="wrap">
    
    <?php the_content(); ?>
    
</div></section>
    

<?php endwhile; endif; ?>
dsfsdfsd
</main>
<?php get_footer(); ?>
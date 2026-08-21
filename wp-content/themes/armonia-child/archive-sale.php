<?php 

/* Template Name: Sale */

get_header(); ?>
<main id="<?php global $post; $page_slug = $post->post_name; echo $page_slug ?>">
   
 <section id="" style=""><div class="wrap" style="padding:10px 0px; text-align: center;justify-content:center;">
    
    <div class="h1"><b><?php the_title(); ?></b></div>
    
</div></section>   
   
<section id="" class=""><div class="wrap">

    <?php the_content(); ?>
</div></section>
 
   
    
</main>
<?php get_footer(); ?>
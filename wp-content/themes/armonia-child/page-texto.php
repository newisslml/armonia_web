<?php
/* Template Name: Página de texto */
get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<main id="<?php global $post; $page_slug = $post->post_name; echo $page_slug ?>" class="page">

<section id="" class=""><div class="wrap">

    <div class="wrap_col contenido_texto">
        <h1 class="h2"><?php the_title(); ?></h1>
        <?php the_content(); ?>
    </div>

</div></section>

</main>
<?php endwhile; endif; ?>
<?php get_footer(); ?>

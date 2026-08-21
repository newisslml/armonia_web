<?php 

/* Template Name: Contacto */

get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?> 
<main id="<?php global $post; $page_slug = $post->post_name; echo $page_slug ?>">
   
   
   
<section id="section1" class=""><div class="wrap">
    
    
    <div class="wrap_col">
    <div class="titulo_seccion h1">CONTÁCTANOS</div>
    <?php the_content(); ?><br>
    
    <?php if( have_rows('medios_de_contacto') ): while ( have_rows('medios_de_contacto') ) : the_row(); ?>
        <?php if( have_rows('directo') ): while ( have_rows('directo') ) : the_row(); ?>
           
            <?php if( get_sub_field('telefono_1') ): ?>
            <div class="h3"><?php the_sub_field('telefono_1'); ?></div>
            <?php endif; ?>
           
            <?php if( get_sub_field('telefono_2') ): ?>
            <div class="h3"><?php the_sub_field('telefono_2'); ?></div>
            <?php endif; ?>
           
            <?php if( get_sub_field('correo_1') ): ?>
            <div class="h3"><?php the_sub_field('correo_1'); ?></div>
            <?php endif; ?>
           
            <?php if( get_sub_field('correo_2') ): ?>
            <div class="h3"><?php the_sub_field('correo_2'); ?></div>
            <?php endif; ?>
           
            <?php if( get_sub_field('direccion_1') ): ?>
            <div class="h3"><?php the_sub_field('direccion_1'); ?></div>
            <?php endif; ?>
           
            <?php if( get_sub_field('direccion_2') ): ?>
            <div class="h3"><?php the_sub_field('direccion_2'); ?></div>
            <?php endif; ?>
            
        <?php endwhile; endif; ?>
    <?php endwhile; endif; ?>

    </div>
    
    
    <div class="wrap_col">
        <?php echo do_shortcode('[contact-form-7 id="8" title="Formulario de contacto 1"]'); ?>
    </div>
    
    
</div></section>
    
   
    
</main>
<?php endwhile; endif; ?>
<?php get_footer(); ?>
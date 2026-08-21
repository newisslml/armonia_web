// Llamar RRSS
<?php include(TEMPLATEPATH.'/scripts/rrss.php'); ?>






<!----------------------------	LOOPS  ----------------------------->




<!--	SINGLE LOOP		-->
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<?php endwhile; endif; ?>




<!--	PAGINA DETERMINADA	-->
<?php query_posts('pagename=contacto'); while (have_posts ()): the_post(); ?> 
<?php endwhile; wp_reset_query(); ?>




<!--	QUERY POST	-->
<?php
$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
$args = array(
    'post_type' => 'articulos',
    'category_name' => 'sin-categoria',
  	'posts_per_page' => 2,
    'orderby' => 'title',
    'order' => 'asc',
  	'paged' => $paged
);
 
$query = new WP_Query( $args ); if ( $query->have_posts() ) { ?>
 
<?php while ( $query->have_posts() ) { $query->the_post(); ?>
 
            <li <?php post_class( 'left' ); ?>>
                <a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
                    <?php the_title(); ?>
                </a>
            </li>
 
<?php } ?>
<?php } wp_reset_postdata(); ?>





<!--	CHILD PAGES	-->
<?php
$args = array(
    'post_type'      => 'page',
    'posts_per_page' => -1,
    'post_parent'    => $post->ID,
    'order'          => 'ASC',
    'orderby'        => 'menu_order'
);
$parent = new WP_Query( $args ); if ( $parent->have_posts() ) : ?>
<?php while ( $parent->have_posts() ) : $parent->the_post(); ?>

    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    
<?php endwhile; ?>
<?php endif; wp_reset_postdata(); ?>




<!--	QUERY POST OFF SET	-->
<?php
$current_page = get_query_var('paged');
$current_page = max( 1, $current_page );

$per_page = 3;
$offset_start = 1;
$offset = ( $current_page - 1 ) * $per_page + $offset_start;
$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
$args = array(
    'post_type' => 'articulos',
    'category_name' => 'sin-categoria',
  	'posts_per_page' => $per_page, 
	'offset' => $offset,
    'orderby' => 'title',
    'order' => 'asc',
  	'paged' => $paged
);
 
$query = new WP_Query( $args ); if ( $query->have_posts() ) { ?>
<ul>
<?php while ( $query->have_posts() ) { $query->the_post(); ?>
 
            <li <?php post_class( 'left' ); ?>>
                <a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
                    <?php the_title(); ?>
                </a>
            </li>
 
<?php } ?>
</ul>
<?php } wp_reset_postdata(); ?>

<?php posts_nav_link(); ?>


<!----------------------------	VIDEO  ----------------------------->
<div class="video_hold">
    <div class="video_hold_in"><iframe src="https://www.youtube.com/embed/69H-vtHxbdk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
</div>
<!----------------------------	VIDEO  ----------------------------->





<!----------------------------	PAGINACION  ----------------------------->
<!--	Numeros	-->
<div class="page_nav"><?php wplift_pagination(); ?></div>
<style>.page_nav{display:none; }</style><!-- En caso de infinite loop -->

<!--	Original	-->
<?php posts_nav_link(); ?> <!-- next y prev -->




<!----------------------------	CUSTOM EXCERPT  ----------------------------->
<?php echo excerpt(25); ?>





<!----------------------------	ACF  ----------------------------->

<!--	GROUP FIELD INSIDE	-->
<?php if( have_rows('imagen_corporativa') ): while ( have_rows('imagen_corporativa') ) : the_row(); ?>
<?php endwhile; endif; ?>



<!--	IMAGE ID	-->
<?php $image = get_sub_field('logo_superior'); $size = 'full'; ?>
<img alt="<?php bloginfo('title'); ?>" src="<?php echo wp_get_attachment_image_url( $image, $size ); ?>" >



<!--	IF ACF EXIST	-->
<?php if( get_field('field_name') ): ?>
	<?php the_field('field_name'); ?>
<?php endif; ?>



<!--	ACF VALUE LABEL	-->
<?php $field = get_field_object('field') ?>
	<?php echo $field['value'] ?>
	<?php echo $field['label'] ?>
<?php endif; ?>


<!--	GALERIA DE IMAGENES CON ACF GALLERY	 (IMAGENES EN ARRAY)-->
<?php $images = get_field('galeria_lugar'); if( $images ):
    shuffle($images); // randomizes the image array
    $max = 12; // set the max here;
    $count = 0; // current count
?>
    <div class="galeria">
        <?php foreach( $images as $image ):
            $count++; // increment count
            if ($count > $max) { break; }?>
                
                <a data-fancybox="galeria" class="galeria_item" href="<?php echo $image['sizes']['medium-fixed']; ?>" rel="lightbox">
                    <div class="foto" style="background-image:url(<?php echo $image['sizes']['medium-fixed']; ?>);"><div class="over"></div></div>
                </a>
                
        <?php endforeach; ?>
    </div>
    
<?php endif; ?>




<!----------------	SLICK	-------------------------->
<div class="slider" id="">
    <div class="slider_in">
      <div class="slide">Slide 2</div>
      <div class="slide">Slide 3</div>
      <div class="slide">Slide 4</div>
      <div class="slide">Slide 5</div>
      <div class="slide">Slide 6</div>
      <div class="slide">Slide 7</div>
      <div class="slide">Slide 8</div>
      <div class="slide">Slide 9</div>
      <div class="slide">Slide 10</div>
    </div>
</div>
<!----------------------	BOTONES	-------------------->
    <div id="tecnologia_botones">
    <?php if( have_rows('tecnologia') ): $i = -1; while ( have_rows('tecnologia') ) : the_row(); $i++; ?>
    
        <div class="tecnologia_boton">
        	<div class="table"><div class="table_cell">
				<?php $icono = get_sub_field('icono'); $size = 'thumbnail'; ?>
            	<a data-slide-index="<?php echo $i; ?>" href="" style="background-image:url('<?php echo wp_get_attachment_image_url( $icono, $size ); ?>'); " ></a>
            	<span><?php the_sub_field('titulo'); ?></span>
            </div></div>
      	</div>
        
    <?php endwhile; endif; ?>  
	</div>
	<!----------------------	BOTONES	-------------------->

<script>jQuery(document).ready(function($){

    $('#slider_home .slider_in').bxSlider({
        //pagerCustom: '#tecnologia_botones', //mode debe estar en fade
        mode: 'fade', //horizontal', 'vertical', 'fade'
        infiniteLoop: 'true', //true, false
        pager:true, // Puntos
        controls: true, // Flechas
        auto:false,
        adaptiveHeight: true,
        // Carousel
        minSlides:1,
        maxSlides:1,
        slideWidth:0,
        
        //
		onSliderLoad: function(){
            $(this).css("display", "block");
            //gsap.from('#slider_home .h1',{duration: 3, opacity: 1, y:-100 });
        },
		onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            //gsap.from('#slider_home .h1',{duration: 3, opacity: 1, y:-100 });
        },
		onSlideBefore: function () {
            //gsap.from('#slider_home .h1',{duration: 3, opacity: 1, y:-100 });
        },
        
    });     
        
});</script>


<script>jQuery(document).ready(function(){
    // CARROUSEL RESIZE
    var slider_portafolio = $('#slider_portafolio .slider_in');
    var windowWidth = $(window).width();  
    var obxSettings = {
                slideWidth: 900,
            slideMargin: 20,
            minSlides: 3,
            maxSlides: 3,
            moveSlides: 1,
            pager: false,
            controls:true,
            infiniteLoop: true,
            touchEnabled: false,
        
            //
            onSliderLoad: function(){
                slider_portafolio.css("display", "block");
                gsap.from('#slider_header .h1',{duration: 3, opacity: 1, y:-100 });
            },
            onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
                console.log(currentSlideHtmlObject);
                gsap.from('#slider_header .h1',{duration: 3, opacity: 1, y:-100 });
            },
            onSlideBefore: function () {
                gsap.from('#slider_header .h1',{duration: 3, opacity: 1, y:-100 });
            },
    
    };
    slider_portafolio.bxSlider(obxSettings);

    $(window).resize(function() {
        windowWidth = $(window).width();
        if(windowWidth < 768) {
            obxSettings.minSlides = 1;
            slider_portafolio.reloadSlider();
        } else if(windowWidth < 1024) {
            obxSettings.minSlides = 2;
            slider_portafolio.reloadSlider();
        }else{
            obxSettings.minSlides = 3;
            slider_portafolio.reloadSlider();
        }
     });

    $(window).load(function() {
        windowWidth = $(window).width();
        if(windowWidth < 768) {
            obxSettings.minSlides = 1;
            slider_portafolio.reloadSlider();
        } else if(windowWidth < 1024) {
            obxSettings.minSlides = 2;
            slider_portafolio.reloadSlider();
        }else{
            obxSettings.minSlides = 3;
            slider_portafolio.reloadSlider();
        }
     });
});


/* Registrar nuevo tipo de post */

add_action( 'init', 'deals' );
function deals() {
	$labels = array(
    	'name' => __('Libros', 'post type general name'),
      	'singular_name' => __('Libro', 'post type singular name'),
       	'add_new' => __('Añadir nuevo Libro', 'Libro'),
       	'add_new_item' => __('Añadir nuevo libro'),
        'edit_item' => __('Editar libro'),
        'new_item' => __('Nueva libro'),
        'view_item' => __('Ver libro'),
        'search_items' => __('Buscar libros'),
        'not_found' =>  __('No se ha encontrado nada'),
        'not_found_in_trash' => __('No se ha encontrado nada en la papelera'),
	);
   	$args = array(
     	'labels' => $labels,
		'menu_icon' => ('dashicons-admin-multisite'),
        'public' => true,
        'hierarchical' => false,
        'menu_position' => 5,
        'has_archive' => true,
        'query_var' => true,
        'supports' => array('title','editor','thumbnail'),
        'rewrite' => array('slug' => 'deals'),
		'taxonomies'          => array( 'category' ), // Para agregar categorias al post type //
	);
	
	register_post_type( 'deals', $args );
}


/* 
Crear archivos: 
archive-deals.php
single-deals.php

*/



/*  REORDENAR MENU ADMIN     */


  // Rearrange the admin menu
  function custom_menu_order($menu_ord) {
    if (!$menu_ord) return true;
    return array(
      'index.php', // Dashboard
      'edit.php?post_type=ilustraciones', 
      'edit.php?post_type=product', 
	  'edit.php?post_type=clases',
	  'edit.php?post_type=blog',
	  'edit.php?post_type=shop_order',
      'separator1', // First separator
      'edit.php?post_type=page', // Pages
      'edit.php', // Posts
      'upload.php', // Media
      'link-manager.php', // Links
      'edit-comments.php', // Comments
      'separator2', // Second separator
      'themes.php', // Appearance
      'plugins.php', // Plugins
      'users.php', // Users
      'tools.php', // Tools
      'options-general.php', // Settings
      'separator-last', // Last separator
    );
  }

  add_filter('custom_menu_order', 'custom_menu_order'); // Activate custom_menu_order
  add_filter('menu_order', 'custom_menu_order');



function post_remove ()      //creating functions post_remove for removing menu item
{ 
   remove_menu_page('edit.php');
}

add_action('admin_menu', 'post_remove'); 


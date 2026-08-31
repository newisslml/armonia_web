<?php
/* ponytail: el theme trae varios scripts inline que asumen jQuery ya cargado (ej. filtro de categoría,
   botones +/- de cantidad). WordPress moderno registra jquery-core con strategy=defer, lo que puede
   dejarlos correr antes de que jQuery exista. Se saca ese defer solo para jQuery, sin tocar el resto. */
function monas_jquery_sin_defer( $tag, $handle ) {
    if ( in_array( $handle, array( 'jquery', 'jquery-core' ), true ) ) {
        $tag = str_replace( ' defer', '', $tag );
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'monas_jquery_sin_defer', 20, 2 );

function monas_theme_enqueue_styles() {
$parent_style = 'parent-style'; // Estos son los estilos del tema padre recogidos por el tema hijo.
$randomNumber = rand(); 
    wp_deregister_style( 'stylesheet' );
    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.min.css');
    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . "/style.min.css?version=" . $randomNumber );   
    
}
add_action( 'wp_enqueue_scripts', 'monas_theme_enqueue_styles',20 );



function monas_childs_scripts() {
    
    wp_register_script( 'child-scripts', get_stylesheet_directory_uri().'/scripts/child-scripts.min.js', array('jquery'), null, true );
	wp_enqueue_script( 'child-scripts' );
	

}
add_action('wp_enqueue_scripts', 'monas_childs_scripts',11);




function monas_fonts(){
    
    wp_enqueue_style( 'custom-font-uno', '//fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap', false );
    
    wp_enqueue_style( 'custom-font-dos', '//fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap', false );
    
 }
add_action("wp_enqueue_scripts", "monas_fonts");



/*//////////////////////////////////////////////////////////
WOOCOMMERCE
//////////////////////////////////////////////////////////*/
function claserama_edit_checkout_fields($fields){
     unset($fields['billing']['billing_postcode']);



     $fields['billing']['billing_country']['priority'] = 31;
     $fields['billing']['billing_state']['priority'] = 32;
     $fields['billing']['billing_city']['priority'] = 33;
     $fields['billing']['billing_city']['label'] = 'Comuna';

     if ( isset( $fields['shipping']['shipping_city'] ) ) {
         $fields['shipping']['shipping_city']['label'] = 'Comuna';
     }

     $fields['billing']['billing_phone']['placeholder'] = '+56912345678';
     $fields['billing']['billing_phone']['custom_attributes'] = array(
         'pattern'  => '\+569[0-9]{8}',
         'title'    => 'Formato: +56 seguido de 9 y 8 dígitos, ej: +56912345678',
         'maxlength' => '12',
     );

     return $fields;
}
add_filter('woocommerce_checkout_fields','claserama_edit_checkout_fields');

function monas_validar_telefono_checkout(){
    $phone = isset( $_POST['billing_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['billing_phone'] ) ) : '';
    if ( $phone && ! preg_match( '/^\+569[0-9]{8}$/', $phone ) ) {
        wc_add_notice( 'El teléfono debe tener el formato +56912345678.', 'error' );
    }
}
add_action( 'woocommerce_checkout_process', 'monas_validar_telefono_checkout' );



/*-- WOOCOMMERCE STYLESHEET --*/
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

function monas_woo_styles() {
    $randomNumber = rand(); 
    wp_register_style( 'stylesheet_woo', get_stylesheet_directory_uri() . '/woocommerce/woo_style.min.css?version=' . $randomNumber);
	wp_enqueue_style( 'stylesheet_woo' );  
    
    wp_register_script( 'woo_scripts', get_stylesheet_directory_uri() .'/woocommerce/woo-scripts.min.js', array('jquery'), null, true );
	wp_enqueue_script( 'woo_scripts' );
    
}
add_action('wp_enqueue_scripts', 'monas_woo_styles',19);
/*-- WOOCOMMERCE STYLESHEET --*/


function woo_widgets_init() {

	register_sidebar( array(
		'name'          => 'Woocommerce Bar',
		'id'            => 'woobar',
		'before_widget' => '<div class="box">',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="rounded">',
		'after_title'   => '</h2><hr>',
	) );

}
add_action( 'widgets_init', 'woo_widgets_init' );




/*-- SIGNOS MAS & MENOS ---*/
add_action( 'woocommerce_after_add_to_cart_quantity', 'ts_quantity_plus_sign' );
 
function ts_quantity_plus_sign() {
   echo '<button type="button" class="plus button" >+</button>';
}
 
add_action( 'woocommerce_before_add_to_cart_quantity', 'ts_quantity_minus_sign' );

function ts_quantity_minus_sign() {
   echo '<button type="button" class="minus button" >-</button>';
}
 
add_action( 'wp_footer', 'ts_quantity_plus_minus' );
 
function ts_quantity_plus_minus() {
   // To run this on the single product page
   if ( ! is_product() ) return;
   ?>
   <script type="text/javascript">
          
      jQuery(document).ready(function($){   
          
            var formCart = $('form.cart');
            formCart.find('.quantity.hidden').prev().hide();
            formCart.find('.quantity.hidden').next().hide();
          
            $('form.cart').on( 'click', 'button.plus, button.minus', function() {
 
            // Get current quantity values
            var qty = $( this ).closest( 'form.cart' ).find( '.qty' );
            var val   = parseFloat(qty.val());
            var max = parseFloat(qty.attr( 'max' ));
            var min = parseFloat(qty.attr( 'min' ));
            var step = parseFloat(qty.attr( 'step' ));
 
            // Change the value if plus or minus
            if ( $( this ).is( '.plus' ) ) {
               if ( max && ( max <= val ) ) {
                  qty.val( max );
               } 
            else {
               qty.val( val + step );
                 }
            } 
            else {
               if ( min && ( min >= val ) ) {
                  qty.val( min );
               } 
               else if ( val > 1 ) {
                  qty.val( val - step );
               }
            }
             
         });
          
      });
          
   </script>
   <?php
    
    
};
/*-- SIGNOS MAS & MENOS ---*/


//* Mostrar 16 productos por página en WooCommerce
add_filter( 'loop_shop_per_page', function( $cols ) { return 30; } );


/* ponytail: en las páginas de categoría, WooCommerce inserta antes de los productos unas
   "tarjetas" de subcategoría que en este theme salen sin imagen y ensucian la vista. La
   navegación por categorías ya la resuelve el desplegable propio de archive-product.php,
   así que forzamos que la tienda y todas las categorías muestren SOLO productos.
   (Anula también el ajuste "Display type" de cada categoría en el admin.) */
add_filter( 'woocommerce_get_loop_display_mode', 'armonia_tienda_solo_productos' );
function armonia_tienda_solo_productos( $display_mode ) {
    return 'products';
}


add_shortcode ('woo_cart_but', 'woo_cart_but' );
// Create Shortcode for WooCommerce Cart Menu Item
function woo_cart_but() {
	ob_start();
 
        $cart_count = WC()->cart->cart_contents_count; // Set variable for cart item count
        $cart_url = wc_get_cart_url();  // Set Cart URL
  
        ?>
        
        <a class="menu-item cart-contents woo_btn cart" href="<?php echo $cart_url; ?>" title="Mi bolsa" >
        
            <div class="woo_btn_in">
                <div class="icono" >
                    <?php if ( $cart_count >= 0 ) { ?>
                        <span class="cart-contents-count"><?php echo $cart_count; ?></span>
                    <?php  } ?>
                </div>
                <div class="texto">Carrito</div>
            </div>
        </a>

        <?php
	        
    return ob_get_clean();
 
}





add_filter( 'woocommerce_add_to_cart_fragments', 'woo_cart_but_count' );
// Add AJAX Shortcode when cart contents update 
function woo_cart_but_count( $fragments ) {
 
    ob_start();
    
    $cart_count = WC()->cart->cart_contents_count;
    $cart_url = wc_get_cart_url();
    
    ?>
        
        <a class="menu-item cart-contents woo_btn cart" href="<?php echo $cart_url; ?>" title="Mi bolsa" >
        <div class="woo_btn_in">
            <div class="icono" >
                <?php if ( $cart_count >= 0 ) { ?>
                    <span class="cart-contents-count"><?php echo $cart_count; ?></span>
                <?php  } ?>
            </div>
            <div class="texto">Carrito</div>
        </div>    
        </a>

        <?php
 
    $fragments['a.cart-contents'] = ob_get_clean();
     
    return $fragments;
}




add_filter( 'wp_nav_menu_menu-woocommerce_items', 'woo_cart_but_icon', 10, 2 ); // Change menu to suit - example uses 'top-menu'
// Add WooCommerce Cart Menu Item Shortcode to particular menu
function woo_cart_but_icon ( $items, $args ) {
       $items .=  do_shortcode('[woo_cart_but]'); // Adding the created Icon via the shortcode already created
       
       return $items;
}

add_action( 'pre_get_posts', 'ayudawp_ocultar_agotados' );
function ayudawp_ocultar_agotados( $q ) {
    if ( ! $q->is_main_query() || is_admin() ) {
        return;
    }
    if ( $outofstock_term = get_term_by( 'name', 'outofstock', 'product_visibility' ) ) {
        $tax_query = (array) $q->get('tax_query');
        $tax_query[] = array(
            'taxonomy' => 'product_visibility',
            'field' => 'term_taxonomy_id',
            'terms' => array( $outofstock_term->term_taxonomy_id ),
            'operator' => 'NOT IN'
        );
        $q->set( 'tax_query', $tax_query );
    }
    remove_action( 'pre_get_posts', 'ayudawp_ocultar_agotados' );
}


/*//////////////////////////////////////////////////////////
BUSCADOR: resultados por categoría/etiqueta + sugerencias
//////////////////////////////////////////////////////////*/

// La búsqueda del sitio es para la tienda: que sólo devuelva productos (search.php asume que todo resultado es un producto).
function armonia_buscador_solo_productos( $q ) {
    if ( $q->is_search() && $q->is_main_query() && ! is_admin() ) {
        $q->set( 'post_type', 'product' );
    }
}
add_action( 'pre_get_posts', 'armonia_buscador_solo_productos' );

// El buscador de WordPress sólo compara contra título/contenido del producto, nunca contra el nombre
// de su categoría o etiqueta. Por eso "aromaterapia" sólo traía productos que tenían esa palabra escrita
// en el nombre, dejando afuera el resto de los productos correctamente clasificados en esa categoría.
// Acá sumamos, como alternativa OR dentro del mismo bloque de búsqueda, los productos cuya categoría o
// etiqueta calza con el término buscado.
function armonia_buscador_incluye_categorias( $search, $wp_query ) {
    global $wpdb;

    if ( empty( $search ) || ! $wp_query->is_search() || is_admin() ) {
        return $search;
    }
    $term = $wp_query->get( 's' );
    if ( empty( $term ) ) {
        return $search;
    }

    $like = '%' . $wpdb->esc_like( $term ) . '%';

    $post_ids = $wpdb->get_col( $wpdb->prepare(
        "SELECT DISTINCT tr.object_id
         FROM {$wpdb->term_relationships} tr
         INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         INNER JOIN {$wpdb->terms} t ON t.term_id = tt.term_id
         WHERE tt.taxonomy IN ('product_cat','product_tag') AND t.name LIKE %s",
        $like
    ) );

    if ( empty( $post_ids ) ) {
        return $search;
    }

    $ids_sql = implode( ',', array_map( 'intval', $post_ids ) );
    $trimmed = rtrim( $search );

    // $search llega como " AND ((post_title LIKE ..) OR (..)) " (fragmento aislado de WP_Query::parse_search()).
    // Le quitamos el último paréntesis de cierre, agregamos la condición extra y lo volvemos a cerrar.
    if ( substr( $trimmed, -1 ) === ')' ) {
        $search = substr( $trimmed, 0, -1 ) . " OR ({$wpdb->posts}.ID IN ({$ids_sql}))) ";
    }

    return $search;
}
add_filter( 'posts_search', 'armonia_buscador_incluye_categorias', 10, 2 );

// Sugerencias en vivo mientras se escribe en la barra de búsqueda (categorías + productos).
function armonia_buscador_sugerencias() {
    $term = isset( $_GET['term'] ) ? sanitize_text_field( wp_unslash( $_GET['term'] ) ) : '';
    if ( mb_strlen( $term ) < 2 ) {
        wp_send_json( array() );
    }

    $resultados = array();

    $categorias = get_terms( array(
        'taxonomy'   => 'product_cat',
        'name__like' => $term,
        'number'     => 3,
        'hide_empty' => true,
    ) );
    if ( ! is_wp_error( $categorias ) ) {
        foreach ( $categorias as $cat ) {
            $resultados[] = array(
                'tipo'  => 'categoria',
                'texto' => $cat->name,
                'url'   => get_term_link( $cat ),
            );
        }
    }

    $productos = get_posts( array(
        'post_type'      => 'product',
        's'              => $term,
        'search_columns' => array( 'post_title' ),
        'posts_per_page' => 6,
        'post_status'    => 'publish',
    ) );
    foreach ( $productos as $producto ) {
        $wc_producto = wc_get_product( $producto );
        $resultados[] = array(
            'tipo'   => 'producto',
            'texto'  => get_the_title( $producto ),
            'precio' => $wc_producto ? wp_strip_all_tags( $wc_producto->get_price_html() ) : '',
            'url'    => get_permalink( $producto ),
        );
    }

    wp_send_json( $resultados );
}
add_action( 'wp_ajax_armonia_buscador_sugerencias', 'armonia_buscador_sugerencias' );
add_action( 'wp_ajax_nopriv_armonia_buscador_sugerencias', 'armonia_buscador_sugerencias' );

function armonia_buscador_localize() {
    wp_localize_script( 'child-scripts', 'ArmoniaBuscador', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'armonia_buscador_localize', 12 );


/*
function mode_maintenance(){     if(!current_user_can('edit_themes') || !is_user_logged_in()){         wp_die('<div style="border:solid 1px grey;"><h1 style="color:#FF942A; text-align:center; text-transform:uppercase;">Sitio en Mantenimiento</h1><p style="text-align:center; font-size:18px;">Estamos trabajando en el nuevo sitio ¡en breve estaremos online!</p></div>', 'Sitio en Mantenimiento', array( 'response' => 503 ));      } } add_action('init', 'mode_maintenance'); 
*/


?>
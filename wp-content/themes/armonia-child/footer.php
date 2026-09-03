<footer><section>
   
<div class="wrap">
    
    
    <div id="menuFooter" class="wrap_col">
        <div class="titulo_footer">Secciones<hr></div>
        <?php wp_nav_menu( array( 'theme_location' => 'menu_sup', 'menu_class' => 'primary', 'fallback_cb' => '') ); ?>
    </div>
    
    <div id="info" class="wrap_col">
        <?php query_posts('pagename=informacion-general'); while (have_posts ()): the_post(); ?> 

                <a href="<?php bloginfo('url'); ?>" id="logo_footer">
                    <?php $image = get_field('logo_footer'); $size = 'full'; ?>
                    <img alt="<?php bloginfo('title'); ?>" src="<?php echo wp_get_attachment_image_url( $image, $size ); ?>" >
                </a>
        
        
        <?php endwhile; wp_reset_query(); ?>
        
        
        
    </div>
    
    
    <div id="contacto" class="wrap_col">
        <div class="titulo_footer">Newsletter<hr></div>
        <div><?php echo do_shortcode('[newsletter]'); ?></div>
        <br>
        <div class="titulo_footer">Puedes pagar con<hr></div>
        <img class="pagos" src="<?php bloginfo('url'); ?>/wp-content/uploads/2020/12/transbank-1-e1519932743964.png">
    </div>
    
    
    <div id="derechos" class="wrap_col">
        <div class="links_legales">
            <a href="<?php echo esc_url( home_url( '/terminos-y-condiciones/' ) ); ?>">Términos y condiciones</a> ·
            <a href="<?php echo esc_url( home_url( '/faq/' ) ); ?>">Preguntas frecuentes</a> ·
            <a href="<?php echo esc_url( home_url( '/reembolso_devoluciones/' ) ); ?>">Devoluciones y reembolsos</a>
        </div>
        <div>&copy; <?php echo date('Y'); ?> Todos los derechos reservados por <?php bloginfo('title'); ?></div>
    </div>

</div>


</section></footer>

<a href="https://wa.me/56979617459" class="whatsapp_float" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C10 9 9.5 7.8 9.3 7.3c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.8 3.6 13.4 3.6 12c0-4.6 3.8-8.4 8.4-8.4s8.4 3.8 8.4 8.4-3.8 8.4-8.4 8.4z"/></svg>
</a>

</div>
</body>
<?php wp_footer(); ?>
</html>
<?php if (in_category('noticias')) { 
	include(TEMPLATEPATH.'');
}elseif(in_category('')) {
	include(TEMPLATEPATH.'/single-original.php');
}else{
	include(TEMPLATEPATH.'/single-original.php');
}; ?>
<?php
/**
 * @package Silence_Notices
 * @version 1.0.0
 */
/*
Plugin Name: Silence Notices
Description: Hides Admin Notices for friendlier screenshotting.
Author: Greg Bell
Version: 1.0.0
*/

// We need some CSS to position the paragraph.
function hide_notices() {
	echo '
    <style type="text/css">
    body.wp-admin:not(.theme-editor-php) .notice:not(.updated),
    body.wp-admin .update-nag,
    body.wp-admin #adminmenu .awaiting-mod, 
    #adminmenu .update-plugins,
    #message.woocommerce-message,
    body.wp-admin .plugin-update.colspanchange,
    .notice.elementor-message.elementor-message-dismissed
    {display: none !important;}
    
    body.wp-admin #display-notifications .notice,
    body.wp-admin #display-notifications .update-nag,
    #display-notifications #message.woocommerce-message 
    {
        display: block !important;
    }
    </style>
	';
}

add_action( 'admin_head', 'hide_notices' );

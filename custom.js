// JavaScript Document

$(document).ready(function(){

	$('.submenu-deploy').click(function(){
		$(this).parent().find('.nav-submenu').toggle(100);
		$(this).parent().find('.sidebar-decoration').toggle(100);
		$(this).find('em').toggleClass('dropdown-item');
		return false;
	});
	
	$('.wide-image a').click(function(){
		$(this).parent().parent().find('.wide-active').toggle(100);
	});
	
	$('.update-button').click(function(){
		$(this).parent().find('.page-update-text').toggle(100);
		$(this).parent().find('.update-icon').toggleClass('active-update-icon');
	});
	
	$('.style-changer').click(function(){
		return false;
	});
	
	$('.close-nav, .sidebar-close, .shortcut-close').click(function(){
		snapper.close();
	});
	
	$('.shortcut-search').click(function(){
		$('.sidebar-shortcuts').hide();
		$('.sidebar-search').show();
	});

	$('.search-close').click(function(){
		$('.sidebar-search').hide();
		$('.sidebar-shortcuts').show();
	});

	$('.open-nav').click(function(){
		//$(this).toggleClass('remove-sidebar');
		if( snapper.state().state=="left" ){
			snapper.close();
		} else {
			snapper.open('left');
		}
		return false;
	});
	
	$('.wide-image').click(function(){
		$(this).parent().find('.wide-item-content').toggle(50);
		return false;
	});

	var snapper = new Snap({
	  element: document.getElementById('content'),
      disable: 'none'
	});

	$('.deploy-sidebar').click(function(){
		//$(this).toggleClass('remove-sidebar');
		if( snapper.state().state=="left" ){
			snapper.close();
		} else {
			snapper.open('left');
		}
		return false;
	});

    $('.deploy-sidebar2').click(function(){
		//$(this).toggleClass('remove-sidebar');
		if( snapper.state().state=="right" ){
			snapper.close();
		} else {
			snapper.open('right');
		}
		return false;
	});

	
});
;(function($, window, document) {

	"use strict";

	/**
	 * Define global vars
	 */
	var $window = $(window),
		$html = $("html"),
		$body = $("body"),
		$header = $("#header");

	/**
	 * Add width value to affixed sidebar
	 */
	var addWidthAffix = function(){
		var affix = $('.sidebar[data-spy="affix"], .sidebar.custom-affix '),
			affixWid = affix.parent().width();
		affix.width(affixWid);
	};

	/**
	 * Do Twitter slider (based on caroufredsel)
	 */
	var doTweetsSlider = function(elem,tweets){
		var element = $(elem),
			tweetList = '';
		if (element.length) {
			$.each(tweets, function(i, el) {
				tweetList += '<li>' + el + '</li>';
			});
			$(element).prepend('<ul class="tweets">' + tweetList + '</ul>');
			if($.fn.carouFredSel != 'undefined') {
				$(element).find('.tweets').carouFredSel({
					responsive: true,
					width: '1140',
					scroll: 1,
					auto: 5000,
					items: {
						width: "1140",
						height: "variable"
					},
					prev : {
						button  : $(element).find('.ts-prev'),
						key     : "left"
					},
					next : {
						button  : $(element).find('.ts-next'),
						key     : "right"
					}
				});
			}
		}
	};

	/**
	 * Initialize carousels based on CarouFredSel
	 * .caroufredsel class mandatory
	 * data-setup attribute needed (please find examples within the site)
	 */
	var initCarouFredSels = function(dom){
		// check if dom param is added, if not use $body
		dom = typeof dom !== 'undefined' ? dom : $body;
		// start carousel trigger with options
		var cfs_container = $(dom).find(".caroufredsel:not(.custom)");
		// check if element exists so it can begin the job
		if (!cfs_container.length) return;
		// iterate through finds
		$.each( cfs_container, function(index, el) {
			var _el = $(el),
				_data_attribs = _el.attr("data-setup"),
				_options = typeof _data_attribs != 'undefined' ? JSON.parse(_data_attribs) : '{}',
				_nav = $('<div class="cfs--navigation"><a href="#" class="cfs--prev"></a><a href="#" class="cfs--next"></a></div>'),
				_pag = $('<div class="cfs--pagination"></div>'),
				_cfParent = _el.closest('.caroufredsel').parent();

			if(_options.navigation)
				( _options.appendToParent  ? _cfParent : _el ).append(_nav);

			if(_options.pagination)
				( _options.appendToParent ? _cfParent : _el ).append(_pag);

			if(_options.swipe_touch || _options.swipe_mouse)
				_el.addClass('stl-swiper');

			var doCarouFredSels = function(){
				_el.children('ul.slides').carouFredSel({
					responsive: _options.hasOwnProperty('responsive') ? _options.responsive : true,
					width: _options.hasOwnProperty('width') ? _options.width : null,
					height: _options.hasOwnProperty('height') ? _options.height : null,
					align: _options.hasOwnProperty('align') ? _options.align : 'left',
					scroll: {
						items: _options.hasOwnProperty('scroll') ? _options.scroll : 1,
						fx : _options.hasOwnProperty('fx') ? _options.fx : "scroll"
					},
					items: {
						visible: _options.hasOwnProperty('items') ? _options.items : 1,
						minimum: _options.hasOwnProperty('items_minimum') ? _options.items_minimum : 1,
						start: _options.hasOwnProperty('items_start') ? _options.items_start : 0,
						width:_options.hasOwnProperty('items_width') ? _options.items_width : null,
						height: _options.hasOwnProperty('items_height') ? _options.items_height : null
					},
					auto: {
						play: _options.hasOwnProperty('autoplay') ? _options.autoplay : true,
						timeoutDuration: _options.hasOwnProperty('auto_duration') ? _options.auto_duration : 10000
					},
					prev : {
						button  : ( _options.appendToParent ? _cfParent : _el.closest('.caroufredsel') ).find('.cfs--prev'),
						key     : "left"
					},
					next : {
						button  : ( _options.appendToParent ? _cfParent : _el.closest('.caroufredsel') ).find('.cfs--next'),
						key     : "right"
					},
					pagination: {
						container: ( _options.appendToParent ? _cfParent : _el.closest('.caroufredsel') ).find('.cfs--pagination'),
						anchorBuilder: function(nr, item) {
							return '<a href="#'+nr+'"></a>';
						}
					},
					swipe: {
						onTouch: _options.hasOwnProperty('swipe_touch') || Modernizr.touch ? _options.swipe_touch : false,
						onMouse: _options.hasOwnProperty('swipe_mouse') || Modernizr.touch ? _options.swipe_mouse : false
					}
				});
			};

			cfs_container.imagesLoaded(doCarouFredSels);

		});
	};

	/**
	 * Add full viewport height and add it to page slideshow
	 */
	var initFullHeightSldPageHeader = function(){
		var pageSlideshow = $('#page-slideshow.full-height, .page-header-class.full-height'),
			h = $window.height();
		if($body.hasClass('header-absolute'))
			pageSlideshow.css('height', h);
		else
			pageSlideshow.css('height', h - $('#header').height() );
	};

	/**
	 * add alignment for Fluid Containers
	 */
	var initFluidContainerFixedCol = function(){

		$.each( $('.col-normal'), function(i, el) {
			var _el = $(el),
				pContainer = _el.closest('.container-fluid'),
				nContainer = $body.find('#main .container').first();
			if (matchMedia('only screen and (max-width: 1024px)').matches) {
				_el.css({'padding-left': 15, 'padding-right': 15 });
				return;
			}
			imagesLoaded(pContainer, function(){
				var nContainerLeft = nContainer.offset().left,
					nContainerRight = ($window.width() - (nContainerLeft + nContainer.outerWidth()));
				if(_el.hasClass('first'))
					_el.css('padding-left', nContainerLeft+15);
				else if(_el.hasClass('last'))
					_el.css('padding-right', nContainerRight+15);
			});
		});
	};

	/**
	 * On smaller devices, detach the right-nav icons and move them to the main container
	 */
	var detachMoveIcons = function(){
		var rightNavOutside = $('#right-nav-outside'),
			rightNavInside = $('#right-nav-inside');
		if (matchMedia('only screen and (max-width: 1480px)').matches || $body.hasClass('boxed-layout') ) {
			var elms = rightNavOutside.children('li').addClass('items-detached').detach();
			elms.appendTo(rightNavInside);
		} else if (matchMedia('only screen and (min-width: 1481px)').matches) {
			var elms = rightNavInside.children('li.items-detached').removeClass('items-detached').detach();
			elms.appendTo(rightNavOutside);
		}
	};

	/**
	 * Clone main navigation and append to the mobile navigation block
	 */
	var cloneMainNav = function(){
		$('#navigation .vs-menu').clone().appendTo('#main-nav-mobile');
	};

	/**
	 * Prevent click for 1st level menu items in main nav.
	 * Works only on touch based devices
	 * Will prevent default only for menu items with submenus
	 */
	$('.touch .vs-menu > li > .menu-item:not(:only-child)').on('click',function(e) {
		e.preventDefault();
	});

	/**
	 * Functional Google site search
	 */
	var gSearchForm = $('#gsearchform');
	gSearchForm.submit(function(event) {
		gSearchForm.find('input[name="q"]').val( "site:"+ gSearchForm.attr("data-site") +" "+gSearchForm.find('input[name="qfront"]').val() )
	});


	/* This snipet below detects the active menu item in the main navigation
	 * and adds an .current class highlighting it.
	 */
	var pathname = window.location.pathname,
		page = pathname.split(/[/ ]+/).pop(),
		menuItems = jQuery('#navigation a');
	menuItems.each(function(){
		var mi = jQuery(this),
			miHrefs = mi.attr("href"),
			miParents = mi.parents('li');
		if(page == miHrefs) {
			miParents.addClass("current").siblings().removeClass('current');
		}
	});

	/**
	 * Fallback for no-svg browser feature to replace with png source
	 */
	if(!Modernizr.svg) {
		$('img[src*="svg"]').attr('src', function() {
			return $(this).attr('src').replace('.svg', '.png');
		});
	}

	/**
	 * Text Rotators (used for example in a slide of iosslider)
	 */
	if($.fn.textrotator != 'undefined') {
		$(".text-group-slider").each(function(index, el) {
			var $el = $(el);
			$el.textrotator({
				speed: 800,
				separator: '/',
				duration: $el.attr('data-duration') ? $el.attr('data-duration') : 3000
			});
		});
	}

	/**
	 * Initialize Bootstrap tooltips
	 */
	$('[data-toggle=tooltip]').tooltip();


	/**
	 * Detect device environment
	 * If in mobile enviroment add a special class "ismobiledevice" & which type of mobile device, to the body tag
	 */
	$.ajax({
		// url: 'php-helpers/_ismobiledevice.php',
		// success: function(data){
		// 	$body.addClass(data);
		// }
	});


	/**
	 * Search Panel Handlers
	 */
	var searchBtn = $("#header .search_btn"),
		searchBlock = $('#header .search-block');
	searchBtn.on('click', function(e){
		e.preventDefault();
		$header.toggleClass("visible-search");
	});
	$(document).on('click', function(){
		if($("#header").hasClass("visible-search")) $header.removeClass("visible-search");
	});
	$header.on('click', function(event){
		event.stopPropagation();
	});


	/**
	 * Sticky Header
	 */
	if($body.hasClass('header-sticky')) {

		var lastScrollTop = 0,
			stickedPoint = 60,
			headerHeight = $header.outerHeight(true) + (matchMedia('only screen and (max-width: 480px)').matches ? 30 : 0),
			headerHelper = $('<div class="header-helper" style="height: '+ headerHeight +'px" />');
		// Append the helper header holding the height
		$header.after(headerHelper);
		// Do stuff upon scrolling
		$window.scroll(function () {
			var st = $(window).scrollTop();
			// check if it's started scrolling and passed by the sticking point
			if (st > stickedPoint)
				$header.addClass("scrolling");
			else
				$header.removeClass("scrolling");
			// Check if Sticky Header is set to always display when scrolling
			if(!$body.hasClass('hs--always')) {
				// add sticky class to header when scrolling up
				if (st < lastScrollTop && st > stickedPoint){
					$header.addClass("sticked");
				} else if (st > lastScrollTop || st <= stickedPoint){
					$header.removeClass("sticked");
				}
				lastScrollTop = st;
			} else {
				// add sticky class to header when scrolling down
				if (st > stickedPoint){
					$header.addClass("sticked");
					headerHelper.css('height', $header.outerHeight(true) );
				} else {
					$header.removeClass("sticked");
					headerHelper.css('height', headerHeight );
				}

			}
		});
	}


	/**
	 * FitVids - make embed videos responsive
	 * Uncomment to use
	 */
	// if($.fn.fitVids != 'undefined') {
	// 	$(".container").fitVids();
	// }


	/**
	 * Scroll to top button
	 */
	function totop_button(a) {
		var b = $("#totop");
		b.removeClass("off on");
		if (a == "on") { b.addClass("on"); } else { b.addClass("off");}
	}
	setInterval(function () {
		var b = $(this).scrollTop(),
			c = $(this).height();
		if (b > 0) { var d = b + c / 2 } else { var d = 1 }
		if (d < 1e3) { totop_button("off") } else { totop_button("on") }
	}, 300);
	$("#totop").on('click',function (e) {
		e.preventDefault();
		$('body,html').animate({scrollTop:0},800, 'easeOutExpo');
	});

	/**
	 * Scroll to #hash (for example .tonext button)
	 */
	var hashTagActive = "";
	$(".scrolling_btn").on('click',function (e) {
		if(hashTagActive != this.hash) {
			e.preventDefault();
			var dest = 0;
			if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
				dest = $(document).height() - $(window).height();
			} else {
				dest = $(this.hash).offset().top;
			}
			//go to destination
			$('html,body').animate({scrollTop: dest}, 800, 'easeOutExpo');
			hashTagActive = this.hash;
		}
	});


	/* Twitter Feed Fetcher
		* ### HOW TO CREATE A VALID ID TO USE: ###
		* Go to www.twitter.com and sign in as normal, go to your settings page.
		* Go to Widgets on the left hand side.
		* Create a new widget for what you need eg user timeline or search etc.
		* Feel free to check exclude replies if you dont want replies in results.
		* Now go back to settings page, and then go back to widgets page, you should
		* see the widget you just created. Click edit.
		* Now look at the URL in your web browser, you will see a long number like this:
		* 345735908357048478
		* Use this as your ID below instead!
		* more documentation for the api here http://codepen.io/jasonmayes/pen/Ioype
		*/

	// check if twitterFetcher plugin exists
	if (typeof(twitterFetcher) != 'undefined' && twitterFetcher != null) {

		// ******* Tweets in Footer
		var TwFeed = 'twitter-feed',
			TwFeedID = document.getElementById(TwFeed);
		// check if element exists
		if (typeof(TwFeedID) != 'undefined' && TwFeedID != null) {
			// launch plugin
			var configTwitterWig = {
				"id": TwFeedID.getAttribute('data-id') ? TwFeedID.getAttribute('data-id') : '',
				"domId": TwFeed,
				"maxTweets": 2,
				"enableLinks": true,
				"showUser":false,
				"showTime":true,
				"showRetweet":false,
				"showInteraction":false
			}
			twitterFetcher.fetch(configTwitterWig);
		}

		// ******* Tweets in Slider
		var TwSlider = '#twitter-slider';

		if ($(TwSlider).length) {
			var configTwitterInSlider = {
				"id": $(TwSlider).attr('data-id') ? $(TwSlider).attr('data-id') : '',
				"domId": '',
				"maxTweets": 3,
				"enableLinks": true,
				"showUser":false,
				"showTime":true,
				"showRetweet":false,
				"customCallback": function(tweets){
					doTweetsSlider(TwSlider, tweets);
				},
				"showInteraction":false
			}
			twitterFetcher.fetch(configTwitterInSlider);
		}
	}


	/**
	 * Magnific Popup Lightbox
	 */
	if($.fn.magnificPopup != 'undefined') {
		$('a.vs-login-box').magnificPopup({type: 'inline', mainClass: 'mfp-fade mfp-bg-lighter'});

		$('a[data-lightbox="image"]').each(function(i,el){
			//single image popup
			if ($(el).parents('.gallery').length == 0) {
				$(el).magnificPopup({
					type:'image',
					tLoading: ''
				});
			}
		});
	 	$('.gallery.images').each(function(i,el) {
			$(el).magnificPopup({
				delegate: 'a',
				type: 'image',
				gallery: {enabled:true},
				tLoading: ''
			});
		});
		// Notice the .misc class, this is a gallery which contains a variatey of sources
		// links in gallery need data-mfp attributes eg: data-mfp="image"
		$('.gallery.misc > li > a').magnificPopup({
			mainClass: 'mfp-fade',
			type: 'image',
			gallery: {enabled:true},
			tLoading: '',
			callbacks: {
				elementParse: function(item) {
					item.type = $(item.el).attr('data-mfp');
				}
			}
		});
		$('a[data-lightbox="iframe"]').magnificPopup({type: 'iframe', mainClass: 'mfp-fade', tLoading: ''});
		$('a[data-lightbox="inline"]').magnificPopup({type: 'inline', mainClass: 'mfp-fade', tLoading: ''});
		$('a[data-lightbox="ajax"]').magnificPopup({type: 'ajax', mainClass: 'mfp-fade', tLoading: ''});
		$('a[data-lightbox="youtube"], a[data-lightbox="vimeo"], a[data-lightbox="gmaps"]').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			removalDelay: 160,
			preloader: true,
			fixedContentPos: false,
			tLoading: ''
		});
		// big blog ajax popup
		$('.bb-popup').magnificPopup({
			type: 'ajax',
			// alignTop: true,
			overflowY: 'scroll',
			tLoading: '',
			callbacks: {
				ajaxContentAdded: function() {
					initCarouFredSels(this.content);
				}
			}
		});
	}


	/**
	 * Appear Events
	 */
	if($.fn.appear != 'undefined') {

		$('[data-animated], .appear').appear({force_process: true});

		$('[data-animated="fade"]').on('appear', function() {
			$(this).each(function(i,el){ $(el).addClass('fade-animation') });
		});
		$('[data-animated="execute"]').on('appear', function() {
			$(this).each(function(i,el){ $(el).addClass('started') });
		});
	}


	/**
	 * Chart animation based on easyPieChart jQuery plugin
	 */
	if($.fn.appear != 'undefined' && $.fn.easyPieChart != 'undefined') {
		var chart = $(".fundedperc .chart");
		chart.appear();
		$(document.body).on('appear', '.fundedperc .chart', function() {
			chart.easyPieChart({
				animate: 2000,
				barColor : typeof chart.attr('data-color') != 'undefined' ? chart.attr('data-color') : '#EF4A4A',
				trackColor: false,
				lineWidth: 16,
				size: 300,
				lineCap: 'square',
				scaleLength: 0,
				onStep: function(from, to, percent) {
					$(this.el).find('.percent span').text( Math.round(percent));
				}
			});
		});
	}


	/**
	 * Wrap to div and append span to required fields
	 */
	$('#main input[required]:not("radio"):not("checkbox")').wrap('<div class="inp-wrap" />').after('<span />');


	/**
	 * Process items: make the line behind the elements
	 */
	// $(".processitems li").each(function(i,el) {
	// 	$(el).on({
	// 	'mouseenter':function(){
	// 		$(this).prevAll().each(function() {
	// 			$(this).addClass("lined");
	// 		});
	// 	},
	// 	'mouseleave':function(){
	// 		$(this).siblings().each(function() {
	// 			$(this).removeClass("lined");
	// 		});
	// 	}});
	// });


	/**
	 * Quick add to cart button in product listings
	 */
	$.each($(".productitem-quickadd"), function(index, val) {
		$(val).children('a').on('click', function(event){
			event.preventDefault();
			var _t = $(this);
			if(!_t.hasClass('added'))
				_t.addClass('added').find('.text').text("ADDED");
		});
	});


	/**
	 * Image toggle in product page previews
	 */
	$(".product-preview li a").each(function(i,el) {
		var _t = $(el);
		_t.click(function(e) {
			var pr = _t.closest("ul").next(".large-preview"),
				dtsrc = _t.data("src"),
				loader = pr.find("span.load");
			e.preventDefault();
			// fadeout preview-image
			pr.find("img").fadeOut(function(){
				// remove it
				$(this).remove();
				// light-up the loader
				loader.addClass("loading");
				// create new image, append it and reveal it
				var img = $('<img />').hide().attr({ 'src': dtsrc, 'class': 'img-responsive' }).load(function(){
					loader.removeClass("loading");
				}).appendTo(pr).fadeIn();
			});
			// update the large preview
			pr.attr("href", _t.data("large"));
		});
	});


	/**
	 * Quantity controls
	 */
	$(".cart-qty").each(function(index, el) {
		var cartQty = $(el),
			inp = cartQty.children("input"),
			inpMin = inp.attr('min') ? inp.attr('min') : 1,
			math_it_up = {
				"+": function (x) { return parseFloat(x)+1 },
				"-": function (x) { return parseFloat(x)-1 }
			},
			inpVal;
		cartQty.children("button").on("click",function(e){
			e.preventDefault();
			inpVal = math_it_up[$(this).data("operator")]( parseInt(inp.val()) );
			if(inpVal >= inpMin)
				inp.attr("value", inpVal );
		});
	});


	/**
	 * Remove products from cart
	 */
	$(".product-remove").on("click",function(e) {
		$(this).closest('tr').fadeOut('fast', function(){
			$(this).remove()
		});
	});


	/* Caroufredsel */
	if($.fn.carouFredSel != 'undefined') {

	/* Caroufredsel Trigger with options */
		initCarouFredSels();

		/**
		 * PhotoGallery Widget
		 */

		$('.photogallery-widget .caroufredsel').each(function(index, el) {

			var _cfs_main = $(el),
			_cfs_main_slides = _cfs_main.children('ul.slides');

			_cfs_main_slides.children('li').slice(10).remove();

			var updPhotoGalWdgtCounter = function(c) {
					var cfscounter = c.closest('.caroufredsel').find('.cfs-counter'),
						current = c.triggerHandler( 'currentPosition' );
					cfscounter.html( ( current+1 ) +" of "+ c.children().length );
				},
				doPhotoGalWdgt = function (){
					_cfs_main_slides.carouFredSel({
						responsive: true,
						width: 850,
						items: 1,
						auto: 10000,
						prev : {
							button  : _cfs_main.find('.cfs--prev'),
							key     : "left"
						},
						next : {
							button  : _cfs_main.find('.cfs--next'),
							key     : "right"
						},
						scroll: {
							fx: 'crossfade',
							onBefore: function( data ) {
								updPhotoGalWdgtCounter( _cfs_main_slides );
							}
						},
						onCreate: function( data ) {
							updPhotoGalWdgtCounter( _cfs_main_slides );
						},
						pagination: {
							container: _cfs_main.next('.cfs--pagination'),
							anchorBuilder: function(nr, item) {
								var th = _cfs_main.height()/5,
									ths = _cfs_main_slides.children('li'),
									thbg = ths.eq(nr-1).attr('data-thumb'),
									thdesc = ths.eq(nr-1).find('.pg-caption'),
									thdesc_html = thdesc.length > 0 ? thdesc.get(0).outerHTML : '';
								return '<div class="pg-thumb" style="height: '+th+'px"><a href="#'+nr+'" style="background-image:url('+thbg+');"></a>'+ thdesc_html +'</div>';
							}
						},
						swipe: {
							onTouch: Modernizr.touch ? true : false,
							onMouse: Modernizr.touch ? true : false
						}
					});
				}
			// append pagination
			_cfs_main.after('<div class="cfs--pagination"></div>');
			// Load Carousel after images are loaded
			_cfs_main.imagesLoaded(doPhotoGalWdgt);

		});

	} // end checking if carouFredSel is loaded


	/**
	 * Toggle opening submenu
	 */
	$("ul.toggle-menu a + ul").prev().click(function(e) {
		e.preventDefault();
		$(this).parent().toggleClass("opened");
	});


	/**
	 * MailChimp working newsletter
	 * read more http://stackoverflow.com/a/15120409/477958
	 */
	$.each($('form.mc-embedded-subscribe-form'), function(index, el) {
		var newsletterForm = $(el);
		newsletterForm.h5Validate();

		newsletterForm.submit(function(e) {
			e.preventDefault();
			// If data-nldemo="0" attribute don't do nothing, just throw an alert.
			if(newsletterForm.attr('data-nldemo') && cform.attr('data-nldemo') == "0") {
				$.magnificPopup.open({
					items: {
						src: '<div class="white-popup">Newsletter form disabled on demo!</div>',
						type: 'inline'
					},
					closeBtnInside: true
				});
				return;
			}
			if(newsletterForm.h5Validate('allValid')) {
				var notifContainer = newsletterForm.next('.notification_container');
				$.ajax({
					type		: newsletterForm.attr('method'),
					url 		: newsletterForm.attr('action'),
					data 		: newsletterForm.serialize(),
					cache       : false,
					dataType    : 'json',
					contentType	: "application/json; charset=utf-8",
					error       : function(err) {
						notifContainer.html('<div class="alert alert-warning">Could not connect to server. Please try again later.</div>');
					},
					success     : function(data) {
						if (data.result != "success") {
							var message = data.msg.substring(4);
							notifContainer.html('<div class="alert alert-warning">'+message+'</div>');
						} else {
							var message = data.msg;
							notifContainer.html('<div class="alert alert-success">'+message+'</div>');
						}
					}
				});
			}
		});
	});


	/**
	 * Add parallax scrolling effect
	 */
	if(!Modernizr.touch)
		if($.fn.parallaxbg != 'undefined') {
			var parallaxbg = $('.parallax-bg');
			imagesLoaded( parallaxbg, function() {
				parallaxbg.parallaxbg("50%", 0.5, false);
			});
		}


	/**
	 * Adjust stg-bigblog's main block - top position (to be under the header)
	 */
	if(matchMedia('only screen and (min-width: 767px)').matches)
		$('body.stg-bigblog:not(.header-absolute) #main').css('top', $('body.stg-bigblog #header').height());


	/**
	 * Animate numbers in fun facts
	 */
	$('.fun-number').each(function(i, el){
		if(matchMedia('only screen and (min-width: 767px)').matches) {
			// declare it's not appeared yet
			var isAppeared = false;
			// check when it appeared
			$(el).on('appear', function(){
				// check if it's not appeared (and it shouldn't be the first time)
				if(!isAppeared) {
					var _t = $(this);
					// check if countTo plugin exists
					if(typeof($.fn.countTo) != "undefined") {
						// delay it if you want by adding a data-delay="" attribute to the element
						var doFadeIn = setTimeout( function() {
							// first add the fadein class, then animate em' numbers
							_t.addClass('fadein').countTo();
							clearTimeout(doFadeIn);
						}, _t.data('delay') == undefined ? 0 : _t.data('delay'));
					}
					// declare that it finally appeared
					isAppeared = true;
				}
			});
		}
	});



	/**
	 * Vauss Videos
	 * Based on easy background video plugin
	 * Example data setup attribute:
	 * data-setup='{ "position": absolute, "loop": true , "autoplay": true, "muted": true, "mp4":"", "webm":"", "ogg":""  }'
	 */
	$('.vs-video').each(function(index, el) {
		var $video = $(el),
			_vid_controls = $video.next('.vs-video--controls'),
			_vid_playplause = _vid_controls.find('.btn-toggleplay'),
			_vid_audio = _vid_controls.find('.btn-audio'),
			_data_attribs = $video.attr("data-setup"),
			_options = typeof _data_attribs != 'undefined' ? JSON.parse(_data_attribs) : '{}';

		if(_options.height_container == true)
			$video.closest('.video-container').css('height', $video.height());

		if(_options.hasOwnProperty('muted') && _options.muted == true) _vid_audio.children('i').addClass('mute');
		if(_options.hasOwnProperty('autoplay') && _options.autoplay == false) _vid_playplause.children('i').addClass('paused');

		if(typeof video_background != 'undefined') {
			var Video_back = new video_background( $video,
				{
					//Stick within the div or fixed
					"position": _options.hasOwnProperty('position') ? _options.position : "absolute",
					//Behind everything
					"z-index": _options.hasOwnProperty('zindex') ? _options.zindex : "-1",

					//Loop when it reaches the end
					"loop": _options.hasOwnProperty('loop') ? _options.loop : true,
					//Autoplay at start
					"autoplay": _options.hasOwnProperty('autoplay') ? _options.autoplay : false,
					//Muted at start
					"muted": _options.hasOwnProperty('muted') ? _options.muted : true,

					//Path to video mp4 format
					"mp4": _options.hasOwnProperty('mp4') ? _options.mp4 : false,
					//Path to video webm format
					"webm": _options.hasOwnProperty('webm') ? _options.webm : false,
					//Path to video ogg/ogv format
					"ogg": _options.hasOwnProperty('ogg') ? _options.ogg : false,
					//Path to video flv format
					"flv": _options.hasOwnProperty('flv') ? _options.flv : false,
					//Fallback image path
					"fallback_image": _options.hasOwnProperty('poster') ? _options.poster : false,
					// Youtube Video ID
					"youtube": _options.hasOwnProperty('youtube') ? _options.youtube : false,

					// flash || html5
					"priority": _options.hasOwnProperty('priority') ? _options.priority : "html5",
					// width/height -> If none provided sizing of the video is set to adjust
					"video_ratio": _options.hasOwnProperty('video_ratio') ? _options.video_ratio : false,
					// fill || adjust
					"sizing": _options.hasOwnProperty('sizing') ? _options.sizing : "fill",
					// when to start
					"start": _options.hasOwnProperty('start') ? _options.start : 0
				});
			//Toggle play status
			_vid_playplause.on('click',function(e){
				e.preventDefault();
				Video_back.toggle_play();
				$(this).children('i').toggleClass('paused');
			});
			//Toggle mute
			_vid_audio.on('click',function(e){
				e.preventDefault();
				Video_back.toggle_mute();
				$(this).children('i').toggleClass('mute');
			});
			// Check if video is set to play when scrolled in view
			if($video.hasClass('js-play-on-scroll')) {
				$video.appear();
				$(document.body)
					.on('appear', $video, function() {
						Video_back.play();
						_vid_playplause.children('i').removeClass('paused');
					})
					.on('disappear', $video, function() {
						Video_back.pause();
						_vid_playplause.children('i').addClass('paused');
					});
			}
			// Check if inside Caroufredsel and refresh sizes
			if ( $video.parents(".caroufredsel").length == 1 ) {
				$video.closest('.caroufredsel').trigger('updateSizes');
			}
		}
	});


	/**
	 * Form Validation & Send Mail code
	 */
	$.each($('.vs-contact-form form'), function(index, el) {
		var cform = $(el),
			cResponse = $('<div class="cf_response"></div>');
		cform.prepend(cResponse);
		cform.h5Validate();

		cform.submit(function(e) {
			e.preventDefault();
			// If data-sendmail="0" attribute don;t send any mail, just throw an alert.
			if(cform.attr('data-sendmail') && cform.attr('data-sendmail') == "0") {
				$.magnificPopup.open({
					items: {
						src: '<div class="white-popup">Contact form disabled on demo!</div>',
						type: 'inline'
					},
					closeBtnInside: true
				});
				return;
			}

			if(cform.h5Validate('allValid')) {
				cResponse.hide();
				$.post(
					$(this).attr('action'),
					cform.serialize(),
					function(data){
						cResponse.html(data).fadeIn('fast');
						if(data.match('success') != null) {
							cform.get(0).reset();
						}
					}
				); // end post
			}
			return false;
		});
	});


	/**
	 * Side Right Panel Triggers
	 */
	$('#smt, #smp .s-panel--close').on('click', function(e) {
		e.preventDefault();
		$body.toggleClass('sidemenu-opened');
	});

	/**
	 * Main Navigation Triggers
	 */
	$('#mmt, #main-nav-mobile .s-panel--close').on('click', function(e) {
		e.preventDefault();
		$body.toggleClass('mm-opened');
	});

	/**
	 * Add toggle button to view code in bootstrap docs blocks
	 */
	$('.bs-docs-example').each(function(index, el) {
		var $el = $(el),
			code = '<a href="#" class="togglecode"></a>';
		if($el.next().is('pre')) {
			$el.addClass('withcode');
			$el.append(code);
			$el.find('.togglecode').on('click', function(event) {
				event.preventDefault();
				$el.toggleClass('opened');
			});
		}
	});

	/**
	 * Initiate Skrollr on desktop devices
	 */
	if (matchMedia('only screen and (min-width: 767px)').matches && $html.hasClass('no-touch')){
		var s = skrollr.init({
			smoothScrollingDuration:10,
			forceHeight:false
		});
	} else{
		$html.addClass('no-skrollr');
	}


	/**
	 * Bubble Boxes
	 */
	$('.bubble-box').each(function(index, el) {
		var $el = $(el),
			$revealAt = $el.attr('data-reveal-at'),
			$hideAfter = $el.attr('data-hide-after'),
			defaultRevealAt = 1000; // default reveal when scrolling is at xx px
		if(typeof $revealAt == 'undefined' && $revealAt.length <= 0) $revealAt = defaultRevealAt;
		$window.smartscroll(function(event) {
			// reveal the popup
			if ($el.length > 0 && $(window).scrollTop() > $revealAt && (!$el.hasClass('bb--anim-show') && !$el.hasClass('bb--anim-hide'))){
				$el.addClass("bb--anim-show");
				// check if hide after is defined and hide the popupbox
				if(typeof $hideAfter != 'undefined' && $hideAfter.length >= 0) {
					setTimeout(function(){
						$el.removeClass('bb--anim-show').addClass('bb--anim-hide').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
							function() {
								$(this).remove();
						});
					}, $hideAfter)
				}
			}
		});
		$el.find('.bb--close').on('click', function(){
			$el.addClass('bb--anim-hide').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
				function() {
					$(this).remove();
			});
		});

	});


	$(document).ready(function() {

		/**
		 * Add full viewport height and add it to page slideshow
		 */
		initFullHeightSldPageHeader();

		/**
		 * add alignment for Fluid Containers
		 */
		initFluidContainerFixedCol();

		/**
		 * On smaller devices, detach the right-nav icons and move them to the main container
		 */
		detachMoveIcons();

		/**
		 * Clone main navigation and append to the mobile navigation block
		 */
		cloneMainNav();
	});


	$window.load(function(){

		/**
		 * Hide loader upon loading page
		 */
		$('.loader').addClass('hideit');
    	setTimeout(function(){$('.loader').hide();}, 600);

		/**
	     * Check if there's skrollr attached and refresh it
	     */
		if (!$html.hasClass("no-skrollr")) { s.refresh(); }

		/**
		 * Add width value to the Affix bar
		 */
		addWidthAffix();

		/**
		 * Bottom follower ribbon that will be displayed only
		 * when a certain specified block is visible and scrolled into
		 * Blocked on touch featured devices
		 */
		if(!Modernizr.touch)
		$('.js-bottom-follower-block').each(function(index, el) {
			var $el = $(el),
				$attachTo = $el.attr('data-attachTo');
			if($el.hasClass('js-hidemobile') && matchMedia('only screen and (max-width: 767px)').matches) return;
			if(typeof $attachTo != 'undefined' && $attachTo.length > 0) {
				var target = $( $attachTo.indexOf("#") != -1 ? $attachTo : '#'+$attachTo );
				if(target.length > 0) {
					var targetTop = target.offset().top,
						targetHeight = target.outerHeight(true);
					$window.smartscroll(function () {
						var st = $(window).scrollTop(),
							sth = st + $(window).height();
						if (sth > targetTop && sth < ( targetTop + targetHeight) ){
							$el.addClass("visible");
						} else {
							$el.removeClass("visible");
						}
					});
				}
			}
		});


		/**
		 * Text rotator carousel (used in Vauss Lander)
		 */
		if($.fn.carouFredSel != 'undefined') {
			$('.lander-rotator .caroufredsel').each(function(index, el) {
				var $el = $(el), t;
				$el.carouFredSel({
					direction: 'down',
					items: {
						visible: 1,
						start: 0,
						width: '100%',
						height: 40
					},
					scroll:{
						fx: 'scroll',
						easing: 'quadratic',
						duration: 500,
						onBefore: function(data){
							if(data.items.visible[0].dataset.timing == 'longer') {
								t = 5000;
							} else {
								t = 2000;
							}
							$el.triggerHandler('configuration').auto.timeoutDuration = t;
						}
					}
				});
				$el.trigger("updateSizes");
			});
		}


		/**
		 * Equalize Columns in container
		 */
		$('.eq-cols').each(function(index, el) {
			var cols = $(el).children('.row').find('div[class*="col-sm-"]'),
				t=0;
			$(el).imagesLoaded(function(){
				cols.each(function(index, elm) {
					var $elm = $(elm);
					if ( $elm.outerHeight() > t )
						t = $elm.outerHeight();
				});
				cols.each(function(index, elm) {
					$(elm).height(t);
				});
			});
		});

		/**
		 * Popup Box
		 * Works with Magnific popup to open them
		 * data-ppbox-timeout attribute needed to specify the timeout to appear
		 */
		$('.vs-pp-box[data-ppbox-timeout]').each(function(index, el) {

			var $el = $(el),
				pptimeout = $el.attr('data-ppbox-timeout'),
				timeout = (typeof pptimeout == 'undefined' && $(pptimeout).length <= 0) ? pptimeout : 8000;

			var cookieExpireAttr = $el.attr('data-cookie-expire'),
				cookieExpire = (typeof cookieExpireAttr !== 'undefined') ? cookieExpireAttr : 2;

			// Remove cookie if  you want to test
			// $.removeCookie('ppbox', { path: '/' });

			// check if cookie exists
			if(!$.cookie('ppbox')) {
				// show the popupbox
				var timer = setTimeout(function(){
					$.magnificPopup.open({
						items: {
							src: $($el.get(0))
						},
						type: 'inline',
						mainClass: 'mfp-fade mfp-bg-lighter',
						tLoading: ''
					});
				}, timeout);
			}
			// Set cookie and close popup
			$(el).find('.dontshow').on('click',function(e){
				e.preventDefault();
				// Add cookie support
				$.cookie('ppbox', 'hideit', { expires: parseInt(cookieExpire), path: '/' });
				//Close Popup
				$.magnificPopup.close();
			});

		});


		/**
		 * Flickr Feed Images
		 * data-id attribute needed ( get one from http://idgettr.com/ )
		 */
		var ff_container = $('#flickr-feed'),
			ff_limit = (ff_container.attr('data-limit')) ?  ff_container.attr('data-limit') : 6; // if data-limit attribute is set, the limit is user defined, if not, default is 6
		ff_container.removeClass('loading');
		if($.fn.jflickrfeed != 'undefined') {
			ff_container.jflickrfeed({
				limit: ff_limit,
				qstrings: {
					id: ff_container.attr('data-id') ? ff_container.attr('data-id') : '' // your ID here -
				},
				itemTemplate: '<li><a href="{{image_b}}" class="hover-img-zoom"><img src="{{image_s}}" alt="{{title}}" class="img-responsive" /></a></li>',
			},
			function(data) {
				$(this).magnificPopup({
					delegate: 'a',
					type: 'image',
					gallery: {enabled:true},
					tLoading: ''
				});
			});
		}


		/**
		 * Load demo panel only if data-demopanel="enabled" attribute is added to body tag
		 * If browser size bigger than 991px and if device is non-touch featured
		 */
		if(typeof $body.attr('data-demopanel') != 'undefined' && $body.attr('data-demopanel') == 'enabled' && matchMedia('only screen and (min-width: 991px)').matches && !Modernizr.touch){
			$.ajax({
				url: 'assets/_demo-panel/demo-panel.html',
				cache: true,
				success: function(data){
					$body.append(data).addClass('dp-loaded');
					$.getScript("assets/_demo-panel/dp-scripts.js");
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log("Error retrieving content of demo panel.");
				}
			});
		}

	});

	/**
	 * Smart Scroll debouncer
	 */
	$window.smartscroll(function() {

		/**
		 * Check if Sidemenu is opened, if so, close it upon scrolling
		 */
		if($body.hasClass('sidemenu-opened'))
			$body.removeClass('sidemenu-opened');

	});


	/**
	 * Smartresize debouncer
	 */
	$window.smartresize(function(){

		/**
		 * On resize, detach right-nav items into the main container
		 */
		detachMoveIcons();

		/**
		 * Resize Page slideshow container's height
		 */
		initFullHeightSldPageHeader();

		/**
		 * Add alignment for Fluid Containers
		 */
		initFluidContainerFixedCol();

		/**
		 * Add width to the Affix
		 */
		addWidthAffix();

		/**
		 * Refresh no-skrollr
		 */
		if (!$('html').hasClass("no-skrollr") && matchMedia('only screen and (min-width: 767px)').matches ) { s.refresh(); }

	});

})(window.jQuery, window, document);

;(function($){
	"use strict";

	$(document).ready(function() {

		// Header text animation
		  jQuery(".main-title").textillate({ in : {
		      effect: 'bounceInLeft',
		      sync: true
		    }
		  });
		  jQuery("h4[data-role='subtitle']").each(function() {
		    var that = this;
		    jQuery(this).textillate({ in : {
		        effect: 'bounceInLeft',
		        sync: true
		      }
		    });
		  });

		  // Display last header text after checkbox click
		  jQuery("input.questions[type=checkbox]").click(function(){
		    setTimeout(function(){
		      jQuery(".hidden-header").show();
		      jQuery(".hidden-header").textillate({ in : {
		          effect: 'bounceInRight',
		          sync: true
		        }
		      });
		    },3000);
		  });

		  // Diagram change label colors on hover
		  jQuery(".fishbone").children(".btn").hover(function() {
		    var that = this;
		    var indeces = [0, 3, 1, 4, 2, 5];
		    var index = jQuery(this).index();
		    index = indeces[index];
		    var color = jQuery(that).css("background-color");
		    var children = jQuery(".fishbone-tip").children(".btn");
		    jQuery(children[index]).css("background-color", color);
				jQuery(this).mouseleave(function(){
						jQuery(children[index]).css("background-color", "#e6e7e8");
				});
		  });

	});

})(jQuery);

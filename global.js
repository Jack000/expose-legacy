var current_resolution = 1920;
var disqus_shortname = 'jackventures';
var disqus_loaded = false;
var current_slide = $('.slide').get(0);

$(document).ready(function(){

	// pre-set aspect ratio
	$('.slide').each(function(){
		var width = $(this).data('width');
		var height = $(this).data('height');
		
		if(width && height){
			//if(!$(this).find('.image').hasClass('active')){
				// still loading, set height
				var ratio = height/width;
				$(this).css('height',Math.ceil($(this).width()*ratio)+'px');
	//console.log('set'+Math.ceil($(this).width()*ratio)+'px', $(this).find('.content').width(),$(this).find('.content').height());
			//}
		}
		
		var polygon = $(this).find('.post').data('polygon');
		
		if(polygon && polygon.length >= 3){
			//polygon = JSON.parse(polygon);
			//console.log(polygon);
			var now = _now();
			//console.log($(img).parent().find('.content').get(0));
			//setTimeout(function(){
				fillpolygon($(this).find('.content').eq(0),polygon);
			//},10);
			//console.log(_now() - now);
		}
		
		// set colors
		var bodycolor = $(this).data('color7');
		if(bodycolor){
			$(this).find('.post').css('color',bodycolor);
		}

		var bodyhighlight = $(this).data('color6');
		if(bodyhighlight){
			$(this).find('h2, h3, h4').not('.manual').css('color',bodyhighlight);
		}
	});
		
	// resolution select
	$('#resolution').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}
		else{
			$(this).addClass('active');
		}
		return false;
	});
	
	$('#resolution li').click(function(){
		var new_resolution = $(this).data('res');
		
		if(current_resolution != new_resolution){
			current_resolution = new_resolution;
			// update all urls
			$('.slide').each(function(index){
				var set_res = current_resolution;
				if(parseInt($(this).data('maxresolution')) < current_resolution){
					set_res = parseInt($(this).data('maxresolution'));
				}
				$(this).find('img.image').not('.blank').prop('src',pad(index+1,2)+'/'+set_res+'.jpg');
				$(this).find('video.image').not('.blank').prop('src',pad(index+1,2)+'/'+set_res+'.mp4');
			});
			
			// set ui
			$('#resolution li.active').removeClass('active');
			$(this).addClass('active');
			var index = $('#resolution li').index($(this));
			$('#resolution').css('top','-'+(28*index + 5)+'px');
			
			$.cookie('resolution', current_resolution,  { expires: 7, path: '/' });
		}
	});
	
	// click away from dialog
	$('body').click(function(e) {
	    if (!$(e.target).is('#resolution')) {
	        $('#resolution').removeClass('active');
	    }
	    if (!$(e.target).is('#share')) {
	        $('#share').removeClass('active');
	    }
	});
	
	// detect resolution
	var saved_width = $.cookie('resolution');
	var screen_width = $(window).width();
  	
  	if(saved_width){
  		// used cookie value if set
  		$('#resolution li').each(function(i){
			var val = parseInt($(this).data('res'));
			if(saved_width == val){
				$(this).trigger('click');
				return false;
			}
		});
  	}
  	else{
		$('#resolution li').each(function(i){
			var val = parseInt($(this).data('res'));
			if(screen_width >= val-50){
				$(this).trigger('click');
				return false;
			}
		});
			
		if(screen_width < 1024){
			$('#resolution li').last().trigger('click');
		}
	}
	
	$('#resolution').removeClass('active');
	
	scrollcheck();
	
	// set font size based on actual resolution, normalized at 14px/22px for 720
	var fontsize = Math.floor(14*(screen_width/1280));
	var lineheight = Math.floor(22*(screen_width/1280));
	
	if(fontsize < 11){
		fontsize = 11;
	}
	
	if(lineheight < 14){
		lineheight = 14;
	}
	
	$('body').css('font-size',fontsize+'px');
	$('body').css('line-height',lineheight+'px');
	
	// add back hover behavior erased by color changes
	$('#sidebar a').not('.active a').mouseenter(function(){
		var color = $(this).css('color');
		$(this).removeAttr('style');
		$(this).data('prevcolor',color);
		//console.log(color)
	}).mouseleave(function(){
		var color = $(this).data('prevcolor');
		if(color){
			$(this).css('color',color);
		}
	});
	
	// browser detect
	if($.browser.webkit){
		$('.icon').addClass('webkit');
	}
	
	// toggle comments
	$('#commentbutton').click(function(){
		if($('#comments').hasClass('active')){
			$('#comments').removeClass('active');
		}
		else{
			$('#comments').addClass('active');
			$('#share').removeClass('active');
			if(!disqus_loaded){
				(function() {
		            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();

				disqus_loaded = true;
			}
		}
		return false;
	});
	
	$('#commentclose').click(function(){
		$('#comments').removeClass('active');
		return false;
	});
	
	
	$('#sharebutton').click(function(){
		if($('#share').hasClass('active')){
			$('#share').removeClass('active');
		}
		else{
			$('#share').addClass('active');
			$('#comments').removeClass('active');
		}
		return false;
	});

	// download current
	$('#download').click(function(){
		var index = $('.slide').index(current_slide);
		num = pad(index+1,2);
		window.open('/'+dirname+'/'+num+'/'+dirname+'-'+num+'.zip');
		return false;
	});
	
	// text toggle
	$('#textbutton').click(function(){
		if($(this).hasClass('active')){
			$('.post').addClass('hidden');
			$(this).removeClass('active');
			$(this).find('.text').text('show text');
		}
		else{
			$('.post').removeClass('hidden');
			$(this).addClass('active');
			$(this).find('.text').text('hide text');
		}
		
		return false;
	});
});

function scrollcheck(){
	$('.slide').each(function(){
		var currentoverlap = findoverlap(this);				
	
		if((currentoverlap > 0.7) && current_slide != this){
			current_slide = this;
			var index = $('.slide').index(current_slide);
			
			$('.slide').not(this).find('.image').removeClass('active');
			
			// load previous 1 slide, current slide, and the next two slides
			$('.slide .image').each(function(i){
				if(i-index >= -1 && i-index<=2){
					num = pad(i+1,2);
					if($(this).is('video')){
						$(this).prop('src','/'+dirname+'/'+num+'/'+current_resolution+'.mp4');
					}
					else if($(this).is('img')){
						$(this).prop('src','/'+dirname+'/'+num+'/'+current_resolution+'.jpg');
					}
					else if($(this).is('span')){
						// flash fallback
						var param = $(this).find('param').last();
						var obj = $(this).find('object');
						var configjson = param.prop('value').substring(7);
						var config = $.parseJSON(configjson);
						var furl = config.playlist[0].url;
						if(furl.length <= 11 || obj.prop('data').length <= 11){
							config.playlist[0].url = '/'+dirname+'/'+num+'/'+current_resolution+'.mp4';
							param.prop('value','config='+JSON.stringify(config));
							obj.prop('data','/player/flowplayer.swf?cachebreaker='+(new Date().getTime()));
						}
					}
					$(this).removeClass('blank');
				}
				else{
					if($(this).is('video') || $(this).is('img')){
						$(this).prop('src','//:0');
					}
					else if($(this).is('span')){
						$(this).find('object').prop('data','//:0');
					}
					$(this).addClass('blank');
				}
			});
			
			$(current_slide).find('.image').addClass('active');
			
			// set custom colors
			var sidebackground = $(this).data('color2');
			if(sidebackground){
				$('#sidebar .background').css('background-color',sidebackground);
			}
			
			var highcolor = $(this).data('color6');
			var sidecolor = $(this).data('color7');
			if(sidecolor){
				$('#sidebar, #sidebar a').css('color',sidecolor);
				$('#sidebar .active a').css('color',highcolor);
			}
			
			$('#sidebar .icon.webkit').css('background-color',sidecolor);
			$('#sidebar .icon.webkit.monitor').css('background-color',highcolor);
			
			// highlight nav
			
			if(index >= 0){
				$('#marker li.active').removeClass('active');
				$('#marker li').eq(index).addClass('active');
			}
			
			return false;
		}
	});
}

_now = Date.now || function() { return new Date().getTime(); };

throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

var throttled = throttle(scrollcheck, 700);
$(window).scroll(throttled);

function findoverlap(elem)
{
	var winHeight = $(window).height();
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + winHeight;

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
		
	var overlap = (Math.min(elemBottom, docViewBottom) - Math.max(elemTop, docViewTop));
	if(overlap > 0){
		return overlap/(winHeight);
	}
    return 0;
}

// hide content and put polygon content on top 
function fillpolygon(content, polygon){
	//content.hide();
	if(!polygon || polygon.length < 3){
		return false;
	}
	
	// loop back
	polygon.push(polygon[0]);
	//console.log(polygon);
	
	var fill = $('<div class="polygon" />');
	content.after(fill);
	var cwidth = content.width();
	var cheight = content.height();
	//console.log('cstuff',cwidth,cheight,content.get(0));
	content.contents().each(function(){
		//console.log(this, this.nodeName);
		var n = this.nodeName.toLowerCase();
		
		// stuff that goes on a new line, we only care about the first intercept. Won't deal with gaps
		if(n == 'h1' || n == 'h2' || n == 'h3' || n == 'h4' || n == 'h5' || n == 'h6' || n == 'div' || n== 'img' || n == 'hr' || n == 'ul' || n == 'blockquote'){
			// html, no end clip
			var clone = $(this).clone();
			
			var coords = intersect(100*($(this).position().top/content.height()), polygon);
			
			if(coords.length == 0){
				coords = 0;
			}
			else{
				coords = coords.shift();
			}
			if(coords > 0){
				clone.prepend('<span class="filler" style="width: '+coords+'%"></span>');
			}
			
			fill.append(clone);
		}
		else if(n == 'span' || n == 'a' || n == 'strong' || n =='i' || n =='b' || n=='em'){ // stuff that goes inline with text nodes
			
		}
		else if(this.nodeType == 3){ // text node
			var text = this.nodeValue.trim();
			if(!text){
				return true;
			}
			
			var words = text.match(/\S+/g);
			while(words.length > 0){
				// wrap in span so we can get dimensions
				var span = $('<span class="line">&nbsp;</span>');
				fill.append(span);
								
				var left = 100*(span.position().left/cwidth);
				var top = 100*(span.position().top/cheight);
				//console.log('wat',left, top,span.position());
				if(top > 100){
					span.remove();
					return false;
					 break;
				}
				
				var min = left;
				var max = 100;
				
				//console.log(span.position());
				var coords = intersect(top, polygon);
				if(!coords || coords.length < 2){
					min = 0;
					max = 100;
				}
				
				// depending on the x position of the span, we may not care about certain intercepts
				for(var i=0; i<coords.length; i += 2){
					if(coords[i] >= left){
						min = coords[i];
						max = coords[i+1];
						break;
					}
				}				
				
				// shift to min
				span.before('<span class="filler" style="width: '+(min-left)+'%" />');
				
				// type out text until wraps
				for(i=1; i<=words.length; i++){
					var height = span.height();
					
					span.text(words.slice(0, i).join(' '));
					
					var width = 100*(span.width()/cwidth);
					if(min+width > max){
						break;
					}
				}
				
				if(coords.length < 3 || min+max > 100){
					fill.append('<br />');
				}
				
				//console.log(max, span.get(0));
				
				words = words.slice(i);
			}
		}
		else if(this.nodeType == 1){
			fill.append($(this).clone());
		}
	});
	
	content.hide();
}

// find all intersections between a horizontal line at height, and the given polygon
function intersect(height, polygon){
	if(polygon.length < 3){
		return false;
	}
	
	var points = [];
	for(var i=0; i<polygon.length-1; i++){
		var p1 = polygon[i];
		var p2 = polygon[i+1];
		
		// horizontal line
		if(p1.y == p2.y && height == p1.y){
			if(p1.x < p2.x){
				points.push(p1.x);
			}
			else{
				points.push(p2.x);
			}
		}		
		if(p1.y == height && $.inArray(p1.x, points) < 0){
			points.push(p1.x);
		}
		if(p2.y == height && $.inArray(p2.x, points) < 0){
			points.push(p2.x);
		}
		if(p1.y < height && p2.y > height){
			points.push(p1.x + ((height-p1.y)/(p2.y-p1.y))*(p2.x-p1.x));
		}
		else if(p1.y > height && p2.y < height){
			points.push(p2.x + ((height-p2.y)/(p1.y-p2.y))*(p1.x-p2.x));
		}
	}
	
	
	// sort intercepts left to right
	points.sort(function(a,b){
		return a-b;
	});
	
	return points;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// add back browser detect
jQuery.uaMatch = function( ua ) {
ua = ua.toLowerCase();
var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
    /(msie) ([\w.]+)/.exec( ua ) ||
    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
    [];
return {
    browser: match[ 1 ] || "",
    version: match[ 2 ] || "0"
};
};
if ( !jQuery.browser ) {
matched = jQuery.uaMatch( navigator.userAgent );
browser = {};
if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}
// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
    browser.webkit = true;
} else if ( browser.webkit ) {
    browser.safari = true;
}
jQuery.browser = browser;
}

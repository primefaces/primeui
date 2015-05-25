var winW=$(window).width();
var winH=$(window).height();

$(document).ready(function() {
    
    var Showcase = {
    
        menu: $('#MENUSIDE'),
        
        content: $('#CONTENTSIDE'),
        
        categoryLinks: $(".MainLinkText"),
        
        menuVisible: false,
                
        logo: $('#LOGO'),
        
        hiddenMenuIcons: $('.hiddenIcons'),
        
        hiddenLogo: $('#BlueLogo'),
                
        submenus: $('.SubMenuLinkContainer'),
        
        searchInput: $('#menuSearch'),
        
        topLinksCover: $('#PFTopLinksCover'),
        
        contentSideIndent: $('#CONTENTSIDEindent'),
                
        desktopContainer: $(document.body).children('.PC'),
        
        mobileContainer: $(document.body).children('.MOBILE'),
        
        activeMenu: window.activeMenu,
        
        activeSubSubMenu: null,

        highlightMenu: function() {
            this.clearMenuAnimQueue();
            this.hiddenMenuIcons.animate({opacity:1}, 250);
            this.hiddenLogo.animate({opacity:1}, 250);
        },

        unhighlightMenu: function() {
            this.clearMenuAnimQueue();
            this.hiddenMenuIcons.animate({opacity:0}, 250);
            this.hiddenLogo.animate({opacity:0}, 250);
        },
        
        clearMenuAnimQueue: function() {
            
        },
        
        onWinResize: function() {
            this.menu.height($(window).height());
        },
        
        hideSubMenus: function() {
            if(this.activeMenu) {
                $(this.activeMenu).removeClass('MenuSideMainLinkDark').next().hide();
                this.activeMenu = null;
            }
            
            if(this.activeSubSubMenu) {
                $(this.activeSubSubMenu).removeClass('openSubMenuLink');
                this.activeSubSubMenu = null;
            }
        },
        
        openSubMenu: function(header) {
            var headerJQ = $(header);
            
            if(this.activeSubSubMenu) {
                $(this.activeSubSubMenu).removeClass("openSubMenuLink");
                this.activeSubSubMenu = null;
            }
            
            if(this.activeMenu) {
                if(this.activeMenu === header) {
                    headerJQ.removeClass('MenuSideMainLinkDark').next().slideUp(700,"easeInOutQuint");
                    this.activeMenu = null;
                    $.removeCookie('menustate', {path: '/'});
                }
                else {
                    $(this.activeMenu).removeClass('MenuSideMainLinkDark').next().slideUp(700,"easeInOutQuint");
                    headerJQ.addClass("MenuSideMainLinkDark").next().slideDown(700,"easeInOutQuint");
                    this.activeMenu = header;
                    $.cookie('menustate', headerJQ.attr('id'), {path: '/'});
                }
            }
            else {
                headerJQ.addClass("MenuSideMainLinkDark").next().slideDown(700,"easeInOutQuint");
                this.activeMenu = header;
                $.cookie('menustate', headerJQ.attr('id'), {path: '/'});
            }
        },
        
        openSubSubMenu: function(submenuLink){
            if(this.activeSubSubMenu) {
                if(this.activeSubSubMenu !== submenuLink) {
                    $(this.activeSubSubMenu).removeClass("openSubMenuLink");
                    $(submenuLink).addClass("openSubMenuLink");
                    this.activeSubSubMenu = submenuLink;
                }
            }
            else {
                $(submenuLink).addClass("openSubMenuLink");
                this.activeSubSubMenu = submenuLink;
            }
        }
    };
	
	Showcase.onWinResize();
	$(window).on("resize", function() {
        Showcase.onWinResize();
    });
		
	Showcase.menu.perfectScrollbar({
		wheelSpeed: 40,
		suppressScrollX:true
	});
    	
	// menu mouseenter & mouseleave actions start ----------------------------------
	Showcase.menu.on("mouseenter", function() {
        Showcase.highlightMenu();
	})
	.on("mouseleave", function() {
        Showcase.unhighlightMenu();
	});
    
    // open theme switcher combo
    $("#themeSwitcher").on("click",function(){
		$("#GlobalThemeSwitcher").slideDown(500);
	})
    .on("mouseleave",function(){
		$("#GlobalThemeSwitcher").slideUp(1);
	});
    
    $("#GlobalThemeSwitcher > a").on("click", function(e) {
        var theme = $(this).data("theme");
        changeTheme([{name:'globaltheme', value:theme}]);
        PrimeFaces.changeTheme(theme);
        e.preventDefault();
    });
    
    // open theme switcher combo
    $("#pushNav").on("click",function(){
		$("#PushDemos").slideDown(500);
	})
    .on("mouseleave",function(){
		$("#PushDemos").slideUp(1);
	});
    
    //mobile menu
    $('#mobilemenu').on('change', function(e) {
        var url = $(this).val();
        if(url.length > 0) {
            window.location = url;
        }
    });
    
    var sourceTabview = $('#SourceContentSide > div > span > span > div.ui-tabs'),
    lastTabHeader = sourceTabview.find('> ul > li:last');
    if(lastTabHeader.hasClass('tab-doc')) {
        lastTabHeader.one('click.load', function() {
            var classes = lastTabHeader.attr('class').split(' '),
            slide = 0;

            for(var i = 0; i < classes.length; i++) {
                if(classes[i].indexOf('docslide-') === 0) {
                    slide = classes[i].split('-')[1];
                }
            }

            var content = sourceTabview.find('> .ui-tabs-panels > div:last ');
            content.html('<iframe frameborder="0" class="speakerdeck-iframe" style="border: 0px none; background: none repeat scroll 0% 0% transparent; margin: 0px; padding: 0px; width: 100%; height: 1440px;" src="http://speakerdeck.com/player/057b8d7962d2466f9f24cd45f559b8da?slide=' + slide +'"  allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>');
        });

    }
    
     // Search ---------------------------------------
    Showcase.searchInput.on('keyup', function(e) {
        Showcase.hideSubMenus();
        
        if (e.keyCode === 32) {
            $(this).val($(this).val()+" ");
        }
        var searchValue = $(this).val().toLowerCase(),
        matchSub = false;

        $('.SubMenuLinkContainer').each(function() {
            var MenuSideValue = $.trim($(this).prev().children('span').text()).toLowerCase(),
            itemValue;
            
            if(MenuSideValue.search(searchValue) < 0 || searchValue.length === 0) {  
                var Sub = $(this).children('a');

                for(var i = 0; i < Sub.length; i++) {     //for SubMenu
                    itemValue = $.trim(Sub.eq(i).text()).toLowerCase();
                    if(itemValue.search(searchValue) >= 0) {
                        Sub.eq(i).show();
                        matchSub = true;
                    }
                    else{
                        Sub.eq(i).hide();
                    }
                }
                
                if(matchSub) {
                    $(this).prev().show();
                    matchSub = false;
                }
                else {
                    $(this).prev().hide();
                }
            }
            else {
                $(this).children().show();
                $(this).prev().show();
            }
        });
   });
   
   window.Showcase = Showcase;
});

function restoreMenuState() {
    var activeMenuId = $.cookie('menustate');
    window.activeMenu = document.getElementById(activeMenuId);
    
    if(window.activeMenu) {
        $(window.activeMenu).addClass('MenuSideMainLinkDark').next('.SubMenuLinkContainer').show();
    }
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
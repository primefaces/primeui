/**
 * PUI Object 
 */
var PUI = {
    
    zindex : 1000,
    
    gridColumns: {
        '1': 'pui-grid-col-12',
        '2': 'pui-grid-col-6',
        '3': 'pui-grid-col-4',
        '4': 'pui-grid-col-3',
        '6': 'pui-grid-col-2',
        '12': 'pui-grid-col-11'
    },
        
    /**
     *  Aligns container scrollbar to keep item in container viewport, algorithm copied from jquery-ui menu widget
     */
    scrollInView: function(container, item) {        
        var borderTop = parseFloat(container.css('borderTopWidth')) || 0,
        paddingTop = parseFloat(container.css('paddingTop')) || 0,
        offset = item.offset().top - container.offset().top - borderTop - paddingTop,
        scroll = container.scrollTop(),
        elementHeight = container.height(),
        itemHeight = item.outerHeight(true);

        if(offset < 0) {
            container.scrollTop(scroll + offset);
        }
        else if((offset + itemHeight) > elementHeight) {
            container.scrollTop(scroll + offset - elementHeight + itemHeight);
        }
    },
    
    isIE: function(version) {
        return (this.browser.msie && parseInt(this.browser.version, 10) === version);
    },
    
    escapeRegExp: function(text) {
        return text.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    },

    escapeHTML: function(value) {
        return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    },
            
    clearSelection: function() {
        if(window.getSelection) {
            if(window.getSelection().empty) {
                window.getSelection().empty();
            } else if(window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        } else if(document.selection && document.selection.empty) {
                document.selection.empty();
        }
    },
            
    inArray: function(arr, item) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === item) {
                return true;
            }
        }

        return false;
    },
    
    calculateScrollbarWidth: function() {
        if(!this.scrollbarWidth) {
            if(this.browser.msie) {
                var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
                        .css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body'),
                    $textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
                        .css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body');
                this.scrollbarWidth = $textarea1.width() - $textarea2.width();
                $textarea1.add($textarea2).remove();
            }
            else {
                var $div = $('<div />')
                    .css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
                    .prependTo('body').append('<div />').find('div')
                        .css({ width: '100%', height: 200 });
                this.scrollbarWidth = 100 - $div.width();
                $div.parent().remove();
            }
        }

        return this.scrollbarWidth;
    },
    
    //adapted from jquery browser plugin
    resolveUserAgent: function() {
        var matched, browser;

        jQuery.uaMatch = function( ua ) {
          ua = ua.toLowerCase();

          var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
              /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
              /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
              /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
              /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
              /(msie) ([\w.]+)/.exec( ua ) ||
              ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
              ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
              [];

          var platform_match = /(ipad)/.exec( ua ) ||
              /(iphone)/.exec( ua ) ||
              /(android)/.exec( ua ) ||
              /(windows phone)/.exec( ua ) ||
              /(win)/.exec( ua ) ||
              /(mac)/.exec( ua ) ||
              /(linux)/.exec( ua ) ||
              /(cros)/i.exec( ua ) ||
              [];

          return {
              browser: match[ 3 ] || match[ 1 ] || "",
              version: match[ 2 ] || "0",
              platform: platform_match[ 0 ] || ""
          };
        };

        matched = jQuery.uaMatch( window.navigator.userAgent );
        browser = {};

        if ( matched.browser ) {
          browser[ matched.browser ] = true;
          browser.version = matched.version;
          browser.versionNumber = parseInt(matched.version);
        }

        if ( matched.platform ) {
          browser[ matched.platform ] = true;
        }

        // These are all considered mobile platforms, meaning they run a mobile browser
        if ( browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ] ) {
          browser.mobile = true;
        }

        // These are all considered desktop platforms, meaning they run a desktop browser
        if ( browser.cros || browser.mac || browser.linux || browser.win ) {
          browser.desktop = true;
        }

        // Chrome, Opera 15+ and Safari are webkit based browsers
        if ( browser.chrome || browser.opr || browser.safari ) {
          browser.webkit = true;
        }

        // IE11 has a new token so we will assign it msie to avoid breaking changes
        if ( browser.rv )
        {
          var ie = "msie";

          matched.browser = ie;
          browser[ie] = true;
        }

        // Opera 15+ are identified as opr
        if ( browser.opr )
        {
          var opera = "opera";

          matched.browser = opera;
          browser[opera] = true;
        }

        // Stock Android browsers are marked as Safari on Android.
        if ( browser.safari && browser.android )
        {
          var android = "android";

          matched.browser = android;
          browser[android] = true;
        }

        // Assign the name and platform variable
        browser.name = matched.browser;
        browser.platform = matched.platform;

        this.browser = browser;
        $.browser = browser;
    },
    
    getGridColumn: function(number) {
        return this.gridColumns[number + ''];
    }
};

PUI.resolveUserAgent();
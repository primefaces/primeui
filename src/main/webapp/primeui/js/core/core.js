/**
 * PUI Object 
 */
var PUI = {
    
    zindex : 1000,
        
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
    resolveUserAgent: function(ua) {
        var agent = ua.toLowerCase(),
        match = /(chrome)[ \/]([\w.]+)/.exec(agent) ||
            /(webkit)[ \/]([\w.]+)/.exec(agent) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(agent) ||
            /(msie) ([\w.]+)/.exec(agent) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(agent) || [],
        userAgent =  {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        },
        browser = {};

        if(userAgent.browser) {
            browser[userAgent.browser] = true;
            browser.version = userAgent.version;
        }

        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        this.browser = browser;
    }
};

PUI.resolveUserAgent(navigator.userAgent);
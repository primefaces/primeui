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
        return ($.browser.msie && parseInt($.browser.version, 10) === version);
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
    }
};
/**
 * PrimeUI inputtext widget
 */
 (function (factory) {
     if (typeof define === 'function' && define.amd) {
         // AMD. Register as an anonymous module.
         define(['jquery'], factory);
     } else if (typeof module === 'object' && module.exports) {
         // Node/CommonJS
         module.exports = function( root, jQuery ) {
             factory(jQuery);
             return jQuery;
         };
     } else {
         // Browser globals
         factory(jQuery);
     }
 }(function ($) {

    $.widget("primeui.puiinputtext", {
       
        options: {
            disabled: false
        },
       
        _create: function() {
            var input = this.element,
            disabled = input.prop('disabled');

            //visuals
            input.addClass('ui-inputtext ui-widget ui-state-default ui-corner-all');
            
            if(input.prop('disabled')) {
                input.addClass('ui-state-disabled');
            }
            else if(this.options.disabled) {
                this.disable();
            }
            else {
                this._bindEvents();
            }
        },

        _bindEvents: function() {
            var $this = this;
            this.element.on('input.puiinputtext', function() {
                $this._updateFilledState();
            });
        },

        _updateFilledState: function() {
            var value = this.element.val(); 
            isFilled = (value && value.length)
            
            if(isFilled) {
                this.element.addClass('ui-state-filled');
            }
            else {
                this.element.removeClass('ui-state-filled');
            }
        },
        
        _destroy: function() {
            this.element.off('input.puiinputtext');
            this.element.removeClass('ui-inputtext ui-widget ui-state-default ui-state-disabled ui-corner-all');
        },

        disable: function () {
            this.element.prop('disabled', true);
            this.element.addClass('ui-state-disabled');
        },

        enable: function () {
            this.element.prop('disabled', false);
            this.element.removeClass('ui-state-disabled');
        },

        _setOption: function(key, value) {
            if(key === 'disabled') {
                if(value)
                    this.disable();
                else
                    this.enable();
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        }
        
    });
    
}));
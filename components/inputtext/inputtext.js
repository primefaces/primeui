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
            
            if(input.prop('disabled'))
                input.addClass('ui-state-disabled');
            else if(this.options.disabled)
                this.disable();
            else
                this._enableMouseEffects();
        },
        
        _destroy: function() {
            this.element.removeClass('ui-inputtext ui-widget ui-state-default ui-state-disabled ui-state-hover ui-state-focus ui-corner-all');
            this._disableMouseEffects();
        },

        _enableMouseEffects: function () {
            var input = this.element;

            input.on('mouseover.puiinputtext', function() {
                input.addClass('ui-state-hover');
            })
            .on('mouseout.puiinputtext', function() {
                input.removeClass('ui-state-hover');
            })
            .on('focus.puiinputtext', function() {
                input.addClass('ui-state-focus');
            })
            .on('blur.puiinputtext', function() {
                input.removeClass('ui-state-focus');
            });
        },

        _disableMouseEffects: function () {
            this.element.off('mouseover.puiinputtext mouseout.puiinputtext focus.puiinputtext blur.puiinputtext');
        },

        disable: function () {
            this.element.prop('disabled', true);
            this.element.addClass('ui-state-disabled');
            this.element.removeClass('ui-state-focus ui-state-hover');
            this._disableMouseEffects();
        },

        enable: function () {
            this.element.prop('disabled', false);
            this.element.removeClass('ui-state-disabled');
            this._enableMouseEffects();
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
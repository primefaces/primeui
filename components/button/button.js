/**
 * PrimeFaces Button Widget
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

    $.widget("primeui.puibutton", {
       
        options: {
            value: null,
            icon: null,
            iconPos: 'left',
            click: null
        },
        
        _create: function() {
            this.elementText = this.element.text();
            
            var value = this.options.value || (this.elementText === '' ? 'ui-button' : this.elementText),
            icon = this.options.icon || this.element.data('icon'),
            disabled = this.element.prop('disabled'),
            styleClass = null;
            
            if(icon)
                styleClass = (value === 'ui-button') ? 'ui-button-icon-only' : 'ui-button-text-icon-' + this.options.iconPos;
            else
                styleClass = 'ui-button-text-only';

            if(disabled) {
                styleClass += ' ui-state-disabled';
            }
            
            this.element.addClass('ui-button ui-widget ui-state-default ui-corner-all ' + styleClass).text('');
            
            if(icon) {
                this.element.append('<span class="ui-button-icon-' + this.options.iconPos + ' ui-c fa fa-fw ' + icon + '" />');
            }
            
            this.element.append('<span class="ui-button-text ui-clickable">' + value + '</span>');
        },

        _destroy: function() {
            this.element.removeClass('ui-button ui-widget ui-state-default ui-state-active ui-state-disabled ui-corner-all ' + 
                                                    'ui-button-text-only ui-button-icon-only ui-button-text-icon-right ui-button-text-icon-left');
            this.element.children('.fa').remove();
            this.element.children('.ui-button-text').remove();
            this.element.text(this.elementText);
        },
                
        disable: function() {
            this.element.addClass('ui-state-disabled').prop('disabled',true);
        },
        
        enable: function() {
            if(this.element.prop('disabled')) {
                this.element.prop('disabled', false).removeClass('ui-state-disabled');
            }
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
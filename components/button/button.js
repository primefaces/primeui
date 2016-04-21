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
            var element = this.element;
            this.elementText = this.element.text();
            
            var value = this.options.value||(this.elementText === '' ? 'ui-button' : this.elementText),
            disabled = element.prop('disabled'),
            styleClass = null;
            
            if(this.options.icon) {
                styleClass = (value === 'ui-button') ? 'ui-button-icon-only' : 'ui-button-text-icon-' + this.options.iconPos;
            }
            else {
                styleClass = 'ui-button-text-only';
            }

            if(disabled) {
                styleClass += ' ui-state-disabled';
            }
            
            this.element.addClass('ui-button ui-widget ui-state-default ui-corner-all ' + styleClass).text('');
            
            if(this.options.icon) {
                this.element.append('<span class="ui-button-icon-' + this.options.iconPos + ' ui-c fa fa-fw ' + this.options.icon + '" />');
            }
            
            this.element.append('<span class="ui-button-text ui-c">' + value + '</span>');
                        
            if(!disabled) {
                this._bindEvents();
            }
        },

        _destroy: function() {
            this.element.removeClass('ui-button ui-widget ui-state-default ui-state-hover ui-state-active ui-state-disabled ui-state-focus ui-corner-all ' + 
                                                    'ui-button-text-only ui-button-icon-only ui-button-text-icon-right ui-button-text-icon-left');
            this._unbindEvents();
            this.element.children('.fa').remove();
            this.element.children('.ui-button-text').remove();
            this.element.text(this.elementText);
        },
        
        _bindEvents: function() {
            var element = this.element,
            $this = this;
            
            element.on('mouseover.puibutton', function(){
                if(!element.prop('disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).on('mouseout.puibutton', function() {
                $(this).removeClass('ui-state-active ui-state-hover');
            }).on('mousedown.puibutton', function() {
                if(!element.hasClass('ui-state-disabled')) {
                    element.addClass('ui-state-active').removeClass('ui-state-hover');
                }
            }).on('mouseup.puibutton', function(e) {
                element.removeClass('ui-state-active').addClass('ui-state-hover');
                
                $this._trigger('click', e);
            }).on('focus.puibutton', function() {
                element.addClass('ui-state-focus');
            }).on('blur.puibutton', function() {
                element.removeClass('ui-state-focus');
            }).on('keydown.puibutton',function(e) {
                if(e.keyCode == $.ui.keyCode.SPACE || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.NUMPAD_ENTER) {
                    element.addClass('ui-state-active');
                }
            }).on('keyup.puibutton', function() {
                element.removeClass('ui-state-active');
            });

            return this;
        },
        
        _unbindEvents: function() {
            this.element.off('mouseover.puibutton mouseout.puibutton mousedown.puibutton mouseup.puibutton focus.puibutton blur.puibutton keydown.puibutton keyup.puibutton');
        },
        
        disable: function() {
            this._unbindEvents();
            this.element.addClass('ui-state-disabled').prop('disabled',true);
        },
        
        enable: function() {
            if(this.element.prop('disabled')) {
                this._bindEvents();
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
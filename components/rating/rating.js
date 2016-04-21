/**
 * PrimeUI rating widget
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

    $.widget("primeui.puirating", {
       
        options: {
            stars: 5,
            cancel: true,
            readonly: false,
            disabled: false,
            value: 0
        },
        
        _create: function() {
            var input = this.element;
            
            input.wrap('<div />');
            this.container = input.parent();
            this.container.addClass('ui-rating');
            
            var inputVal = input.val(),
            value = inputVal === '' ? this.options.value : parseInt(inputVal, 10);
            
            if(this.options.cancel) {
                this.container.append('<div class="ui-rating-cancel"><a></a></div>');
            }

            for(var i = 0; i < this.options.stars; i++) {
                var styleClass = (value > i) ? "ui-rating-star ui-rating-star-on" : "ui-rating-star";

                this.container.append('<div class="' + styleClass + '"><a></a></div>');
            }
            
            this.stars = this.container.children('.ui-rating-star');

            if(input.prop('disabled')||this.options.disabled) {
                this.container.addClass('ui-state-disabled');
            }
            else if(!input.prop('readonly')&&!this.options.readonly){
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var $this = this;

            this.stars.click(function() {
                var value = $this.stars.index(this) + 1;   //index starts from zero

                $this.setValue(value);
            });

            this.container.children('.ui-rating-cancel').hover(function() {
                $(this).toggleClass('ui-rating-cancel-hover');
            })
            .click(function() {
                $this.cancel();
            });
        },
        
        cancel: function() {
            this.element.val('');
        
            this.stars.filter('.ui-rating-star-on').removeClass('ui-rating-star-on');
            
            this._trigger('oncancel', null);
        },
        
        getValue: function() {
            var inputVal = this.element.val();

            return inputVal === '' ? null : parseInt(inputVal, 10);
        },

        setValue: function(value) {
            this.element.val(value);

            //update visuals
            this.stars.removeClass('ui-rating-star-on');
            for(var i = 0; i < value; i++) {
                this.stars.eq(i).addClass('ui-rating-star-on');
            }
            
            this._trigger('rate', null, value);
        },

        enable: function() {
            this.container.removeClass('ui-state-disabled');
            this._bindEvents();
        },

        disable: function() {
            this.container.addClass('ui-state-disabled');
            this._unbindEvents();
        },

        _unbindEvents: function() {
            this.stars.off();

            this.container.children('.ui-rating-cancel').off();
        },

        _updateValue: function(value) {
            var stars = this.container.children('div.ui-rating-star');
            stars.removeClass('ui-rating-star-on');
            for(var i = 0; i < stars.length; i++) {
                if(i < value) {
                    stars.eq(i).addClass('ui-rating-star-on');
                }
            }

            this.element.val(value);
        },

        _setOption: function(key, value) {
            if(key === 'value') {
                this.options.value = value;
                this._updateValue(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        _destroy: function() {
            this._unbindEvents();
            this.stars.remove();
            this.container.children('.ui-rating-cancel').remove();
            this.element.unwrap();
        }
    });
    
}));
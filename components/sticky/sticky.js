/**
 * PrimeUI sticky widget
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

    $.widget("primeui.puisticky", {
       
        _create: function() {
            this.initialState = {
                top: this.element.offset().top,
                height: this.element.height()
            };
                        
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            this._bindEvents();          
        },
        
        _bindEvents: function() {
            var $this = this,
            win = $(window),
            scrollNS = 'scroll.' + this.id,
            resizeNS = 'resize.' + this.id;

            win.off(scrollNS).on(scrollNS, function() {
                if(win.scrollTop() > $this.initialState.top)
                    $this._fix();
                else
                    $this._restore();
            })
            .off(resizeNS).on(resizeNS, function() {
                if($this.fixed) {
                    $this.element.width($this.ghost.outerWidth() - ($this.element.outerWidth() - $this.element.width()));
                }
            });
        },
                
        _fix: function() {
            if(!this.fixed) {
                this.element.css({
                    'position': 'fixed',
                    'top': 0,
                    'z-index': 10000
                })
                .addClass('ui-shadow ui-sticky');
        
                this.ghost = $('<div class="ui-sticky-ghost"></div>').height(this.initialState.height).insertBefore(this.element);
                this.element.width(this.ghost.outerWidth() - (this.element.outerWidth() - this.element.width()));
                this.fixed = true;
            }
        },

        _restore: function() {
                if(this.fixed) {
                    this.element.css({
                    position: 'static',
                    top: 'auto',
                    width: 'auto'
                })
                .removeClass('ui-shadow ui-sticky');

                this.ghost.remove();
                this.fixed = false;
            }

          }
        
    });
    
}));
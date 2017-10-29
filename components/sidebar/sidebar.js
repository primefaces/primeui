/**
 * PrimeUI sidebar widget
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

    $.widget("primeui.puisidebar", {

        options: {
            position: 'left',
            baseZIndex: 0,
            autoZIndex: true,
            fullScreen: false,
            onShow: null,
            onHide: null
        },

        _create: function() {
            this.element.addClass('ui-sidebar ui-widget ui-widget-content ui-shadow ui-sidebar-' + this.options.position);
            if(this.options.fullScreen) {
                this.element.addClass('ui-sidebar-full');
            }
            
            this.closeIcon = $('<a class="ui-sidebar-close ui-corner-all" href="#" role="button"><span class="fa fa-fw fa-close"></span></a>')
                .prependTo(this.element);
                                
            this._bindEvents();
        },
        
        _bindEvents() {
            var $this = this;
            
            this.closeIcon.on('click.puisidebar', function(e) {
                $this.hide();
                e.preventDefault();
            });
        },
        
        _unbindEvents() {
            this.closeIcon.off('click.puisidebar');
        },
        
        show: function() {
            if(this.options.autoZIndex) {
                this.element.css('z-index', this.options.baseZIndex + (++PUI.zindex));
            }
            this.element.addClass('ui-sidebar-active');
            this._enableModality();
            this._trigger('onShow');
        },
        
        hide: function() {
            this.element.removeClass('ui-sidebar-active');
            this._disableModality();
            this._trigger('onHide');
        },
        
        _enableModality() {
            if(!this.mask) {
                var $this = this;
                this.mask = $('<div class="ui-widget-overlay ui-sidebar-mask"></div>');
                this.mask.css('z-index', parseInt(this.element.css('z-index')) - 1);
                this.mask.on('click.puislider', function() {
                    $this.hide();
                });
                $(document.body).append(this.mask).addClass('ui-overflow-hidden');
            }
        },
            
        _disableModality() {
            if(this.mask) {
                this.mask.off('click.puislider').remove();
                $(document.body).removeClass('ui-overflow-hidden');
                this.mask = null;
            }
        },
        
        _destroy: function() {
            this._unbindEvents();
            this._disableModality();
            this.closeIcon.remove();
            this.element.removeClass('ui-sidebar ui-widget ui-widget-content ui-shadow ui-sidebar-full ui-sidebar-' + this.options.position);
        }
        
    });
}));
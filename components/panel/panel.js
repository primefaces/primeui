/**
 * PrimeUI Panel Widget
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

    $.widget("primeui.puipanel", {

        options: {
            toggleable: false,
            toggleDuration: 'normal',
            toggleOrientation: 'vertical',
            collapsed: false,
            closable: false,
            closeDuration: 'normal',
            title: null,
            footer: null
        },

        _create: function() {
            this.element.addClass('ui-panel ui-widget ui-widget-content ui-corner-all')
                .contents().wrapAll('<div class="ui-panel-content ui-widget-content" />');
            
            if(this.element.attr('title')) {
                this.options.title = this.element.attr('title');
                this.element.removeAttr('title');
            }

            if(this.options.title) {
                this.element.prepend('<div class="ui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all"><span class="ui-panel-title"></span></div>');
            }
            
            if(this.options.footer) {
                this.element.append('<div class="ui-panel-footer ui-widget-content"></div>');
            }

            this.header = this.element.children('div.ui-panel-titlebar');
            this.title = this.header.children('span.ui-panel-title');
            this.content = this.element.children('div.ui-panel-content');
            this.footer = this.element.children('div.ui-panel-footer');

            var $this = this;
            
            if(this.options.title) {
                this._createFacetContent(this.title, this.options.title);
            }
            
            if(this.options.footer) {
                this._createFacetContent(this.footer, this.options.footer);
            }

            if(this.options.closable) {
                this.closer = $('<a class="ui-panel-titlebar-icon ui-panel-titlebar-closer ui-corner-all ui-state-default" href="#"><span class="fa fa-fw fa-close"></span></a>')
                            .appendTo(this.header);

                this.closer.on('click.puipanel', function(e) {
                    $this.close();
                    e.preventDefault();
                });
            }

            if(this.options.toggleable) {
                var icon = this.options.collapsed ? 'fa-plus' : 'fa-minus';

                this.toggler = $('<a class="ui-panel-titlebar-icon ui-panel-titlebar-toggler ui-corner-all ui-state-default" href="#"><span class="fa fa-fw ' + icon + '"></span></a>')
                            .appendTo(this.header);

                this.toggler.on('click.puipanel', function(e) {
                    $this.toggle();
                    e.preventDefault();
                });

                if(this.options.collapsed) {
                    this.content.hide();
                }
            }

            this._bindEvents();
        },

        _bindEvents: function() {
            this.header.children('a.ui-panel-titlebar-icon').on('mouseenter.puipanel', function() {
                $(this).addClass('ui-state-hover');
            })
            .on('mouseleave.puipanel', function() {
                $(this).removeClass('ui-state-hover');
            });
        },

        _unbindEvents: function() {
            this.header.children('a.ui-panel-titlebar-icon').off();
        },

        close: function() {
            var $this = this;

            this._trigger('beforeClose', null);

            this.element.fadeOut(this.options.closeDuration,
                function() {
                    $this._trigger('afterClose', null);
                }
            );
        },

        toggle: function() {
            if(this.options.collapsed) {
                this.expand();
            }
            else {
                this.collapse();
            }
        },

        expand: function() {
            this.toggler.children('.fa').removeClass('fa-plus').addClass('fa-minus');

            if(this.options.toggleOrientation === 'vertical') {
                this._slideDown();
            }
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideRight();
            }
        },

        collapse: function() {
            this.toggler.children('.fa').removeClass('fa-minus').addClass('fa-plus');

            if(this.options.toggleOrientation === 'vertical') {
                this._slideUp();
            }
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideLeft();
            }
        },

        _slideUp: function() {
            var $this = this;

            this._trigger('beforeCollapse');

            this.content.slideUp(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterCollapse');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideDown: function() {
            var $this = this;

            this._trigger('beforeExpand');

            this.content.slideDown(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterExpand');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideLeft: function() {
            var $this = this;

            this.originalWidth = this.element.width();

            this.title.hide();
            this.toggler.hide();
            this.content.hide();

            this.element.animate({
                width: '42px'
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.toggler.show();
                $this.element.addClass('ui-panel-collapsed-h');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideRight: function() {
            var $this = this,
            expandWidth = this.originalWidth||'100%';

            this.toggler.hide();

            this.element.animate({
                width: expandWidth
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.element.removeClass('ui-panel-collapsed-h');
                $this.title.show();
                $this.toggler.show();
                $this.options.collapsed = !$this.options.collapsed;

                $this.content.css({
                    'visibility': 'visible',
                    'display': 'block',
                    'height': 'auto'
                });
            });
        },

        _destroy: function() {
            this._unbindEvents();
            if(this.toggler) {
                this.toggler.children('.fa').removeClass('fa-minus fa-plus');
            }
        },
        
        _createFacetContent: function(anchor, option) {
            var facetValue;
            if($.type(option) === 'string')
                facetValue = option;
            else if($.type(option) === 'function')
                facetValue = option.call();
            
            anchor.append(facetValue);
        }
    });
    
}));

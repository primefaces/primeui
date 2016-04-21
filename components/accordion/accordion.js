/**
 * PrimeUI Accordion widget
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
    
    $.widget("primeui.puiaccordion", {
       
        options: {
             activeIndex: 0,
             multiple: false
        },
        
        _create: function() {
            if(this.options.multiple) {
                this.options.activeIndex = this.options.activeIndex||[0];
            }
        
            var $this = this;
            this.element.addClass('ui-accordion ui-widget ui-helper-reset');

            var tabContainers = this.element.children();

            //primeui
            if(tabContainers.is('div')) {
                this.panelMode = 'native';
                this.headers = this.element.children('h3');
                this.panels = this.element.children('div');
            }
            //primeng
            else {
                this.panelMode = 'wrapped';
                this.headers = tabContainers.children('h3');
                this.panels = tabContainers.children('div');
            }
            
            this.headers.addClass('ui-accordion-header ui-helper-reset ui-state-default').each(function(i) {
                var header = $(this),
                title = header.html(),
                active = $this.options.multiple ? ($.inArray(i, $this.options.activeIndex) !== -1) : (i == $this.options.activeIndex),
                headerClass = (active) ? 'ui-state-active ui-corner-top' : 'ui-corner-all',
                iconClass = (active) ? 'fa fa-fw fa-caret-down' : 'fa fa-fw fa-caret-right';

                header.addClass(headerClass).html('<span class="' + iconClass + '"></span><a href="#">' + title + '</a>');
            });
            
            this.panels.each(function(i) {
                var content = $(this);
                content.addClass('ui-accordion-content ui-helper-reset ui-widget-content'),
                active = $this.options.multiple ? ($.inArray(i, $this.options.activeIndex) !== -1) : (i == $this.options.activeIndex);
                
                if(!active) {
                    content.addClass('ui-helper-hidden');
                }
            });
            
            this.headers.children('a').disableSelection();
            
            this._bindEvents();
        },

        _destroy: function() {
            this._unbindEvents();
            this.element.removeClass('ui-accordion ui-widget ui-helper-reset');
            this.headers.removeClass('ui-accordion-header ui-helper-reset ui-state-default ui-state-hover ui-state-active ui-state-disabled ui-corner-all ui-corner-top');
            this.panels.removeClass('ui-accordion-content ui-helper-reset ui-widget-content ui-helper-hidden');
            this.headers.children('.fa').remove();
            this.headers.children('a').contents().unwrap();
        },
        
        _bindEvents: function() {
            var $this = this;

            this.headers.on('mouseover.puiaccordion', function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')&&!element.hasClass('ui-state-disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).on('mouseout.puiaccordion', function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')&&!element.hasClass('ui-state-disabled')) {
                    element.removeClass('ui-state-hover');
                }
            }).on('click.puiaccordion', function(e) {
                var element = $(this);
                if(!element.hasClass('ui-state-disabled')) {
                    var tabIndex = ($this.panelMode === 'native') ? element.index() / 2 : element.parent().index();

                    if(element.hasClass('ui-state-active')) {
                        $this.unselect(tabIndex);
                    }
                    else {
                        $this.select(tabIndex, false);
                    }
                }

                e.preventDefault();
            });
        },

        _unbindEvents: function() {
            this.headers.off('mouseover.puiaccordion mouseout.puiaccordion click.puiaccordion');
        },

        /**
         *  Activates a tab with given index
         */
        select: function(index, silent) {
            var panel = this.panels.eq(index);

            if(!silent) {
                this._trigger('change', null, {'index': index});
            }
            
            //update state
            if(this.options.multiple) {
                this._addToSelection(index);
            }
            else {
                this.options.activeIndex = index;
            }
            this._show(panel);
        },

        /**
         *  Deactivates a tab with given index
         */
        unselect: function(index) {
            var panel = this.panels.eq(index),
            header = panel.prev();

            header.attr('aria-expanded', false).children('.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
            header.removeClass('ui-state-active ui-corner-top').addClass('ui-corner-all');
            panel.attr('aria-hidden', true).slideUp();

            this._removeFromSelection(index);
        },

        _show: function(panel) {
            //deactivate current
            if(!this.options.multiple) {
                var oldHeader = this.headers.filter('.ui-state-active');
                oldHeader.children('.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
                oldHeader.attr('aria-expanded', false).removeClass('ui-state-active ui-corner-top').addClass('ui-corner-all').next().attr('aria-hidden', true).slideUp();
            }

            //activate selected
            var newHeader = panel.prev();
            newHeader.attr('aria-expanded', true).addClass('ui-state-active ui-corner-top').removeClass('ui-state-hover ui-corner-all')
                    .children('.fa').removeClass('fa-caret-right').addClass('fa-caret-down');

            panel.attr('aria-hidden', false).slideDown('normal');
        },

        _addToSelection: function(nodeId) {
            this.options.activeIndex.push(nodeId);
        },

        _removeFromSelection: function(index) {
            this.options.activeIndex = $.grep(this.options.activeIndex, function(r) {
                return r != index;
            });
        },

        _setOption: function(key, value) {
            if(key === 'activeIndex') {
                this.select(value, true);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        }
        
    });
    
}));
/**
 * PrimeUI tabview widget
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

    $.widget("primeui.puitabview", {
       
        options: {
            activeIndex: 0,
            orientation:'top'
        },
        
        _create: function() {
            var element = this.element;
            this.navContainer = element.children('ul');
            this.tabHeaders = this.navContainer.children('li');
            this.panelContainer = element.children('div');
            this._resolvePanelMode();
            this.panels = this._findPanels();

            element.addClass('ui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container ui-tabview-' + this.options.orientation);
            this.navContainer.addClass('ui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
            this.tabHeaders.addClass('ui-state-default ui-corner-top');
            this.panelContainer.addClass('ui-tabview-panels');
            this.panels.addClass('ui-tabview-panel ui-widget-content ui-corner-bottom');

            this.tabHeaders.eq(this.options.activeIndex).addClass('ui-tabview-selected ui-state-active');
            this.panels.filter(':not(:eq(' + this.options.activeIndex + '))').addClass('ui-helper-hidden');
            
            this._bindEvents();
        },

        _destroy: function() {
            this.element.removeClass('ui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container ui-tabview-' + this.options.orientation);
            this.navContainer.removeClass('ui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
            this.tabHeaders.removeClass('ui-state-default ui-corner-top ui-tabview-selected ui-state-active');
            this.panelContainer.removeClass('ui-tabview-panels');
            this.panels.removeClass('ui-tabview-panel ui-widget-content ui-corner-bottom ui-helper-hidden').removeData('loaded');

            this._unbindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;

            //Tab header events
            this.tabHeaders.on('mouseover.puitabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')&&!element.hasClass('ui-state-active')) {
                            element.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.puitabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')&&!element.hasClass('ui-state-active')) {
                            element.removeClass('ui-state-hover');
                        }
                    })
                    .on('click.puitabview', function(e) {
                        var element = $(this);

                        if($(e.target).is(':not(.fa-close)')) {
                            var index = element.index();

                            if(!element.hasClass('ui-state-disabled') && !element.hasClass('ui-state-active')) {
                                $this.select(index);
                            }
                        }

                        e.preventDefault();
                    });

            //Closable tabs
            this.navContainer.find('li .fa-close')
                .on('click.puitabview', function(e) {
                    var index = $(this).parent().index();

                    $this.remove(index);

                    e.preventDefault();
                });
        },

        _unbindEvents: function() {
            this.tabHeaders.off('mouseover.puitabview mouseout.puitabview click.puitabview');
            this.navContainer.find('li .fa-close').off('click.puitabview');
        },
        
        select: function(index) {
           this.options.activeIndex = index;

           var newPanel = this.panels.eq(index),
           oldHeader = this.tabHeaders.filter('.ui-state-active'),
           newHeader = this._getHeaderOfPanel(newPanel),
           oldPanel = this.panels.filter('.ui-tabview-panel:visible'),
           $this = this;

           //aria
           oldPanel.attr('aria-hidden', true);
           oldHeader.attr('aria-expanded', false);
           newPanel.attr('aria-hidden', false);
           newHeader.attr('aria-expanded', true);

           if(this.options.effect) {
                oldPanel.hide(this.options.effect.name, null, this.options.effect.duration, function() {
                   oldHeader.removeClass('ui-tabview-selected ui-state-active');

                   newHeader.removeClass('ui-state-hover').addClass('ui-tabview-selected ui-state-active');
                   newPanel.show($this.options.name, null, $this.options.effect.duration, function() {
                       $this._trigger('change', null, {'index':index});
                   });
               });
           }
           else {
               oldHeader.removeClass('ui-tabview-selected ui-state-active');
               oldPanel.hide();

               newHeader.removeClass('ui-state-hover').addClass('ui-tabview-selected ui-state-active');
               newPanel.show();

               $this._trigger('change', null, {'index':index});
           }
       },

       remove: function(index) {    
           var header = this.tabHeaders.eq(index),
           panel = this.panels.eq(index);

           this._trigger('close', null, {'index':index});

           header.remove();
           panel.remove();

           this.tabHeaders = this.navContainer.children('li');
           this.panels = this._findPanels();

           if(index < this.options.activeIndex) {
                this.options.activeIndex--;
           }
           else if(index == this.options.activeIndex) {
               var newIndex = (this.options.activeIndex == this.getLength()) ? this.options.activeIndex - 1: this.options.activeIndex,
               newHeader = this.tabHeaders.eq(newIndex),
               newPanel = this.panels.eq(newIndex);
               
               newHeader.removeClass('ui-state-hover').addClass('ui-tabview-selected ui-state-active');
               newPanel.show(); 
           }
       },

       getLength: function() {
           return this.tabHeaders.length;
       },

       getActiveIndex: function() {
           return this.options.activeIndex;
       },

       _markAsLoaded: function(panel) {
           panel.data('loaded', true);
       },

       _isLoaded: function(panel) {
           return panel.data('loaded') === true;
       },

       disable: function(index) {
           this.tabHeaders.eq(index).addClass('ui-state-disabled');
       },

       enable: function(index) {
           this.tabHeaders.eq(index).removeClass('ui-state-disabled');
       },

       _findPanels: function() {
            var containers = this.panelContainer.children();

            //primeui
            if(this.panelMode === 'native') {
                return containers;
            }
            //primeng
            else if(this.panelMode === 'wrapped') {
                return containers.children(':first-child');
            }
       },

       _resolvePanelMode: function() {
            var containers = this.panelContainer.children();
            this.panelMode = containers.is('div') ? 'native' : 'wrapped';
       },

       _getHeaderOfPanel: function(panel) {
            if(this.panelMode === 'native')
                return this.tabHeaders.eq(panel.index());
            else if(this.panelMode === 'wrapped')
                return this.tabHeaders.eq(panel.parent().index());
       },

      _setOption: function(key, value) {
            if(key === 'activeIndex') {
                this.select(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        }

    });
    
}));
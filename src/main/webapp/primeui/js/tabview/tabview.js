/**
 * PrimeUI tabview widget
 */
$(function() {

    $.widget("primeui.puitabview", {
       
        options: {
            activeIndex:0,
            orientation:'top'
        },
        
        _create: function() {
            var element = this.element;
            
            element.addClass('pui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container')
                .children('ul').addClass('pui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all')
                .children('li').addClass('ui-state-default ui-corner-top');
                
            element.addClass('pui-tabview-' + this.options.orientation);

            element.children('div').addClass('pui-tabview-panels').children().addClass('pui-tabview-panel ui-widget-content ui-corner-bottom');

            element.find('> ul.pui-tabview-nav > li').eq(this.options.activeIndex).addClass('pui-tabview-selected ui-state-active');
            element.find('> div.pui-tabview-panels > div.pui-tabview-panel:not(:eq(' + this.options.activeIndex + '))').addClass('ui-helper-hidden');
            
            this.navContainer = element.children('.pui-tabview-nav');
            this.panelContainer = element.children('.pui-tabview-panels');

            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;

            //Tab header events
            this.navContainer.children('li')
                    .on('mouseover.tabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')&&!element.hasClass('ui-state-active')) {
                            element.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.tabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')&&!element.hasClass('ui-state-active')) {
                            element.removeClass('ui-state-hover');
                        }
                    })
                    .on('click.tabview', function(e) {
                        var element = $(this);

                        if($(e.target).is(':not(.fa-close)')) {
                            var index = element.index();

                            if(!element.hasClass('ui-state-disabled') && index != $this.options.selected) {
                                $this.select(index);
                            }
                        }

                        e.preventDefault();
                    });

            //Closable tabs
            this.navContainer.find('li .fa-close')
                .on('click.tabview', function(e) {
                    var index = $(this).parent().index();

                    $this.remove(index);

                    e.preventDefault();
                });
        },
        
        select: function(index) {
           this.options.selected = index;

           var newPanel = this.panelContainer.children().eq(index),
           headers = this.navContainer.children(),
           oldHeader = headers.filter('.ui-state-active'),
           newHeader = headers.eq(newPanel.index()),
           oldPanel = this.panelContainer.children('.pui-tabview-panel:visible'),
           $this = this;

           //aria
           oldPanel.attr('aria-hidden', true);
           oldHeader.attr('aria-expanded', false);
           newPanel.attr('aria-hidden', false);
           newHeader.attr('aria-expanded', true);

           if(this.options.effect) {
                oldPanel.hide(this.options.effect.name, null, this.options.effect.duration, function() {
                   oldHeader.removeClass('pui-tabview-selected ui-state-active');

                   newHeader.removeClass('ui-state-hover').addClass('pui-tabview-selected ui-state-active');
                   newPanel.show($this.options.name, null, $this.options.effect.duration, function() {
                       $this._trigger('change', null, {'index':index});
                   });
               });
           }
           else {
               oldHeader.removeClass('pui-tabview-selected ui-state-active');
               oldPanel.hide();

               newHeader.removeClass('ui-state-hover').addClass('pui-tabview-selected ui-state-active');
               newPanel.show();

               $this._trigger('change', null, {'index':index});
           }
       },

       remove: function(index) {    
           var header = this.navContainer.children().eq(index),
           panel = this.panelContainer.children().eq(index);

           this._trigger('close', null, {'index':index});

           header.remove();
           panel.remove();

           //active next tab if active tab is removed
           if(index == this.options.selected) {
               var newIndex = this.options.selected == this.getLength() ? this.options.selected - 1: this.options.selected;
               this.select(newIndex);
           }
       },

       getLength: function() {
           return this.navContainer.children().length;
       },

       getActiveIndex: function() {
           return this.options.selected;
       },

       _markAsLoaded: function(panel) {
           panel.data('loaded', true);
       },

       _isLoaded: function(panel) {
           return panel.data('loaded') === true;
       },

       disable: function(index) {
           this.navContainer.children().eq(index).addClass('ui-state-disabled');
       },

       enable: function(index) {
           this.navContainer.children().eq(index).removeClass('ui-state-disabled');
       }

    });
});
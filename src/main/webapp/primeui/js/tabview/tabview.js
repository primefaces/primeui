/**
 * PrimeUI tabview widget
 */
(function() {

    $.widget("primeui.puitabview", {
       
        options: {
            activeIndex:0,
            orientation:'top'
        },
        
        _create: function() {
            var element = this.element;
            this.navContainer = element.children('ul');
            this.tabHeaders = this.navContainer.children('li');
            this.panelContainer = element.children('div');
            this.panels = this._findPanels();

            element.addClass('pui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container pui-tabview-' + this.options.orientation);
            this.navContainer.addClass('pui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all')
            this.tabHeaders.addClass('ui-state-default ui-corner-top');
            this.panelContainer.addClass('pui-tabview-panels')
            this.panels.addClass('pui-tabview-panel ui-widget-content ui-corner-bottom');

            this.tabHeaders.eq(this.options.activeIndex).addClass('pui-tabview-selected ui-state-active');
            this.panels.filter(':not(:eq(' + this.options.activeIndex + '))').addClass('ui-helper-hidden');
            
            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;

            //Tab header events
            this.tabHeaders.on('mouseover.tabview', function(e) {
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

           var newPanel = this.panels.eq(index),
           oldHeader = this.tabHeaders.filter('.ui-state-active'),
           newHeader = this._getHeaderOfPanel(newPanel),
           oldPanel = this.panels.filter('.pui-tabview-panel:visible'),
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
           var header = this.tabHeaders.eq(index),
           panel = this.panels.eq(index);

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
           return this.tabHeaders.length;
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
           this.tabHeaders.eq(index).addClass('ui-state-disabled');
       },

       enable: function(index) {
           this.tabHeaders.eq(index).removeClass('ui-state-disabled');
       },

       _findPanels: function() {
            var containers = this.panelContainer.children();

            //primeui
            if(containers.is('div')) {
                this.panelMode = 'native';
                return containers;
            }
            //primeng
            else {
                this.panelMode = 'wrapped';
                return containers.find(':first-child');
            }
       },

       _getHeaderOfPanel: function(panel) {
            if(this.panelMode === 'native')
                return this.tabHeaders.eq(panel.index());
            else if(this.panelMode === 'wrapped')
                return this.tabHeaders.eq(panel.parent().index());
       }

    });
})();
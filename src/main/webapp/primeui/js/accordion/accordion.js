/**
 * PrimeUI Accordion widget
 */
(function() {

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
            this.element.addClass('pui-accordion ui-widget ui-helper-reset');

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
            
            this.headers.addClass('pui-accordion-header ui-helper-reset ui-state-default').each(function(i) {
                var header = $(this),
                title = header.html(),
                active = $this.options.multiple ? ($.inArray(i, $this.options.activeIndex) !== -1) : (i == $this.options.activeIndex);
                headerClass = (active) ? 'ui-state-active ui-corner-top' : 'ui-corner-all',
                iconClass = (active) ? 'pui-icon fa fa-fw fa-caret-down' : 'pui-icon fa fa-fw fa-caret-right';

                header.addClass(headerClass).html('<span class="' + iconClass + '"></span><a href="#">' + title + '</a>');
            });
            
            this.panels.each(function(i) {
                var content = $(this);
                content.addClass('pui-accordion-content ui-helper-reset ui-widget-content'),
                active = $this.options.multiple ? ($.inArray(i, $this.options.activeIndex) !== -1) : (i == $this.options.activeIndex);
                
                if(!active) {
                    content.addClass('ui-helper-hidden');
                }
            });
            
            this.headers.children('a').disableSelection();
            
            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;

            this.headers.mouseover(function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')&&!element.hasClass('ui-state-disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).mouseout(function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')&&!element.hasClass('ui-state-disabled')) {
                    element.removeClass('ui-state-hover');
                }
            }).click(function(e) {
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

            header.attr('aria-expanded', false).children('.pui-icon').removeClass('fa-caret-down').addClass('fa-caret-right');
            header.removeClass('ui-state-active ui-corner-top').addClass('ui-corner-all');
            panel.attr('aria-hidden', true).slideUp();

            this._removeFromSelection(index);
        },

        _show: function(panel) {
            //deactivate current
            if(!this.options.multiple) {
                var oldHeader = this.headers.filter('.ui-state-active');
                oldHeader.children('.pui-icon').removeClass('fa-caret-down').addClass('fa-caret-right');
                oldHeader.attr('aria-expanded', false).removeClass('ui-state-active ui-corner-top').addClass('ui-corner-all').next().attr('aria-hidden', true).slideUp();
            }

            //activate selected
            var newHeader = panel.prev();
            newHeader.attr('aria-expanded', true).addClass('ui-state-active ui-corner-top').removeClass('ui-state-hover ui-corner-all')
                    .children('.pui-icon').removeClass('fa-caret-right').addClass('fa-caret-down');

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
})();
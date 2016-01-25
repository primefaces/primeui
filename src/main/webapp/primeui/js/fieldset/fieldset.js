/**
 * PrimeFaces Fieldset Widget
 */
(function() {

    $.widget("primeui.puifieldset", {
       
        options: {
            toggleable: false,
            toggleDuration: 'normal',
            collapsed: false,
            enhanced: false
        },
        
        _create: function() {
            if(!this.options.enhanced) {
                this.element.addClass('pui-fieldset ui-widget ui-widget-content ui-corner-all').
                    children('legend').addClass('pui-fieldset-legend ui-corner-all ui-state-default');

                this.element.contents().wrapAll('<div class="pui-fieldset-content" />');
                this.content = this.element.children('div.pui-fieldset-content');
                this.legend = this.content.children('legend.pui-fieldset-legend').prependTo(this.element);
            }
            else {
                this.legend = this.element.children('legend');
                this.content = this.element.children('div.pui-fieldset-content');
            }
            
            if(this.options.toggleable) {
                if(this.options.enhanced) {
                    this.toggler = this.legend.children('.pui-fieldset-toggler');
                }
                else {
                    this.element.addClass('pui-fieldset-toggleable');
                    this.toggler = $('<span class="pui-fieldset-toggler fa fa-fw" />').prependTo(this.legend);
                }

                this._bindEvents();
                
                if(this.options.collapsed) {
                    this.content.hide();
                    this.toggler.addClass('fa-plus');
                } 
                else {
                    this.toggler.addClass('fa-minus');
                }
            }
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.legend.on('click.puifieldset', function(e) {$this.toggle(e);})
                            .on('mouseover.puifieldset', function() {$this.legend.addClass('ui-state-hover');})
                            .on('mouseout.puifieldset', function() {$this.legend.removeClass('ui-state-hover ui-state-active');})
                            .on('mousedown.puifieldset', function() {$this.legend.removeClass('ui-state-hover').addClass('ui-state-active');})
                            .on('mouseup.puifieldset', function() {$this.legend.removeClass('ui-state-active').addClass('ui-state-hover');});
        },

        _unbindEvents: function() {
            this.legend.off('click.puifieldset mouseover.puifieldset mouseout.puifieldset mousedown.puifieldset mouseup.puifieldset');
        },
        
        toggle: function(e) {
            var $this = this;

            this._trigger('beforeToggle', e);

            if(this.options.collapsed) {
                this.toggler.removeClass('fa-plus').addClass('fa-minus');
            }
            else {
                this.toggler.removeClass('fa-minus').addClass('fa-plus');
            }

            this.content.slideToggle(this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this._trigger('afterToggle', e);
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _destroy: function() {
            if(this.enhanced) {
                this.element.removeClass('pui-fieldset ui-widget ui-widget-content ui-corner-all')
                            .children('legend').removeClass('pui-fieldset-legend ui-corner-all ui-state-default ui-state-hover ui-state-active');
                this.content.contents().unwrap();

                if(this.options.toggleable) {
                    this.element.removeClass('pui-fieldset-toggleable');
                    this.toggler.remove();
                }
            }            
            
            this._unbindEvents();
        }
        
    });
})();
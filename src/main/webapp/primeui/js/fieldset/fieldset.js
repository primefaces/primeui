/**
 * PrimeFaces Fieldset Widget
 */
$(function() {

    $.widget("primeui.puifieldset", {
       
        options: {
            toggleable: false,
            toggleDuration: 'normal',
            collapsed: false
        },
        
        _create: function() {
            this.element.addClass('pui-fieldset ui-widget ui-widget-content ui-corner-all').
                children('legend').addClass('pui-fieldset-legend ui-corner-all ui-state-default');
            
            this.element.contents().wrapAll('<div class="pui-fieldset-content" />');            
            
            this.content = this.element.children('div.pui-fieldset-content');
            this.legend = this.content.children('legend.pui-fieldset-legend');
            this.legend.prependTo(this.element);
            
            if(this.options.toggleable) {
                this.element.addClass('pui-fieldset-toggleable');
                this.toggler = $('<span class="pui-fieldset-toggler fa fa-fw" />').prependTo(this.legend);
                
                this._bindEvents();
                
                if(this.options.collapsed) {
                    this.content.hide();
                    this.toggler.addClass('fa-plus');
                } else {
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
        }
        
    });
});
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
            
            this.element.contents(':not(legend)').wrapAll('<div class="pui-fieldset-content" />');
            
            this.legend = this.element.children('legend.pui-fieldset-legend');
            this.content = this.element.children('div.pui-fieldset-content');
            
            this.legend.prependTo(this.element);
            
            if(this.options.toggleable) {
                this.element.addClass('pui-fieldset-toggleable');
                this.toggler = $('<span class="pui-fieldset-toggler ui-icon" />').prependTo(this.legend);
                
                this._bindEvents();
                
                if(this.options.collapsed) {
                    this.content.hide();
                    this.toggler.addClass('ui-icon-plusthick');
                } else {
                    this.toggler.addClass('ui-icon-minusthick');
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
                this.toggler.removeClass('ui-icon-plusthick').addClass('ui-icon-minusthick');
            } else {
                this.toggler.removeClass('ui-icon-minusthick').addClass('ui-icon-plusthick');
            }

            this.content.slideToggle(this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this._trigger('afterToggle', e);
                $this.options.collapsed = !$this.options.collapsed;
            });
        }
        
    });
});
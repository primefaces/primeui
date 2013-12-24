/**
 * PrimeUI inputtext widget
 */
$(function() {

    $.widget("primeui.puiinputtext", {
       
        _create: function() {
            var input = this.element,
            disabled = input.prop('disabled');

            //visuals
            input.addClass('pui-inputtext ui-widget ui-state-default ui-corner-all');
            
            if(disabled) {
                input.addClass('ui-state-disabled');
            }
            else {
                this._enableMouseEffects();
            }

            //aria
            input.attr('role', 'textbox').attr('aria-disabled', disabled)
                                          .attr('aria-readonly', input.prop('readonly'))
                                          .attr('aria-multiline', input.is('textarea'));
        },
        
        _destroy: function() {

        },

        _enableMouseEffects: function () {
            var input = this.element;
            input.hover(function () {
                input.toggleClass('ui-state-hover');
            }).focus(function () {
                    input.addClass('ui-state-focus');
                }).blur(function () {
                    input.removeClass('ui-state-focus');
                });
        },

        _disableMouseEffects: function () {
            var input = this.element;
            input.off( "mouseenter mouseleave focus blur" );

        },

        disable: function () {
            this.element.prop('disabled', true);
            this.element.attr('aria-disabled', true);
            this.element.addClass('ui-state-disabled');
            this.element.removeClass('ui-state-focus ui-state-hover');
            this._disableMouseEffects();
        },

        enable: function () {
            this.element.prop('disabled', false);
            this.element.attr('aria-disabled', false);
            this.element.removeClass('ui-state-disabled');
            this._enableMouseEffects();
        }
        
    });
    
});
/**
 * PrimeFaces Button Widget
 */
$(function() {

    $.widget("primeui.puibutton", {
       
        options: {
            value: null,
            icon: null,
            iconPos: 'left',
            click: null
        },
        
        _create: function() {
            var element = this.element,
            elementText = element.text(),
            value = this.options.value||(elementText === '' ? 'pui-button' : elementText),
            disabled = element.prop('disabled'),
            styleClass = null;
            
            if(this.options.icon) {
                styleClass = (value === 'pui-button') ? 'pui-button-icon-only' : 'pui-button-text-icon-' + this.options.iconPos;
            }
            else {
                styleClass = 'pui-button-text-only';
            }

            if(disabled) {
                styleClass += ' ui-state-disabled';
            }
            
            this.element.addClass('pui-button ui-widget ui-state-default ui-corner-all ' + styleClass).text('');
            
            if(this.options.icon) {
                this.element.append('<span class="pui-button-icon-' + this.options.iconPos + ' ui-icon ' + this.options.icon + '" />');
            }
            
            this.element.append('<span class="pui-button-text">' + value + '</span>');
            
            //aria
            element.attr('role', 'button').attr('aria-disabled', disabled);    
            
            if(!disabled) {
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var element = this.element,
            $this = this;
            
            element.on('mouseover.puibutton', function(){
                if(!element.prop('disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).on('mouseout.puibutton', function() {
                $(this).removeClass('ui-state-active ui-state-hover');
            }).on('mousedown.puibutton', function() {
                if(!element.hasClass('ui-state-disabled')) {
                    element.addClass('ui-state-active').removeClass('ui-state-hover');
                }
            }).on('mouseup.puibutton', function(e) {
                element.removeClass('ui-state-active').addClass('ui-state-hover');
                
                $this._trigger('click', e);
            }).on('focus.puibutton', function() {
                element.addClass('ui-state-focus');
            }).on('blur.puibutton', function() {
                element.removeClass('ui-state-focus');
            }).on('keydown.puibutton',function(e) {
                if(e.keyCode == $.ui.keyCode.SPACE || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.NUMPAD_ENTER) {
                    element.addClass('ui-state-active');
                }
            }).on('keyup.puibutton', function() {
                element.removeClass('ui-state-active');
            });

            return this;
        },
        
        _unbindEvents: function() {
            this.element.off('mouseover.puibutton mouseout.puibutton mousedown.puibutton mouseup.puibutton focus.puibutton blur.puibutton keydown.puibutton keyup.puibutton');
        },
        
        disable: function() {
            this._unbindEvents();
            
            this.element.attr({
                'disabled':'disabled',
                'aria-disabled': true
            }).addClass('ui-state-disabled');
        },
        
        enable: function() {
            this._bindEvents();
            
            this.element.removeAttr('disabled').attr('aria-disabled', false).removeClass('ui-state-disabled');
        }
    });
});
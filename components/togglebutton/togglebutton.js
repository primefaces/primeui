/**
 * PrimeUI togglebutton widget
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

    $.widget("primeui.puitogglebutton", {
       
        options: {
            onLabel: 'Yes',
            offLabel: 'No',
            onIcon: null,
            offIcon: null,
            checked: false
        },
       
        _create: function() {
            this.element.wrap('<div class="ui-button ui-togglebutton ui-widget ui-state-default ui-corner-all" />');
            this.container = this.element.parent();
            
            this.element.addClass('ui-helper-hidden-accessible');
            if(this.options.onIcon && this.options.offIcon) {
                this.container.addClass('ui-button-text-icon-left');
                this.container.append('<span class="ui-button-icon-left fa fa-fw"></span>');
            }
            else {
                this.container.addClass('ui-button-text-only');
            }
            this.container.append('<span class="ui-button-text"></span>');
            
            if(this.options.style) {
                this.container.attr('style', this.options.style);
            }
            
            if(this.options.styleClass) {
                this.container.attr('class', this.options.styleClass);
            }
            
            this.label = this.container.children('.ui-button-text');
            this.icon = this.container.children('.fa');
            
            //initial state
            if(this.element.prop('checked')||this.options.checked) {
                this.check(true);
            } else {
                this.uncheck(true);
            }
            
            if(!this.element.prop('disabled')) {
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.container.on('mouseover.puitogglebutton', function() {
                if(!$this.container.hasClass('ui-state-active')) {
                    $this.container.addClass('ui-state-hover');
                }
            }).on('mouseout.puitogglebutton', function() {
                $this.container.removeClass('ui-state-hover');
            })
            .on('click.puitogglebutton', function() {
                $this.toggle();
                $this.element.trigger('focus');
            });
            
            this.element.on('focus.puitogglebutton', function() {            
                $this.container.addClass('ui-state-focus');
            })
            .on('blur.puitogglebutton', function() {            
                $this.container.removeClass('ui-state-focus');
            })
            .on('keydown.puitogglebutton', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.SPACE) {
                    e.preventDefault();
                }
            })
            .on('keyup.puitogglebutton', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.SPACE) {
                    $this.toggle();

                    e.preventDefault();
                }
            });
        },
        
        _unbindEvents: function() {
            this.container.off('mouseover.puitogglebutton mouseout.puitogglebutton click.puitogglebutton');
            this.element.off('focus.puitogglebutton blur.puitogglebutton keydown.puitogglebutton keyup.puitogglebutton');
        },
        
        toggle: function() {
            if(this.element.prop('checked'))
                this.uncheck();
            else
                this.check();
        },

        check: function(silent) {
            this.container.addClass('ui-state-active');
            this.label.text(this.options.onLabel);
            this.element.prop('checked', true);

            if(this.options.onIcon) {
                this.icon.removeClass(this.options.offIcon).addClass(this.options.onIcon);
            }

            if(!silent) {
                this._trigger('change', null, {checked: true});
            }
        },

        uncheck: function(silent) {
            this.container.removeClass('ui-state-active')
            this.label.text(this.options.offLabel);
            this.element.prop('checked', false);

            if(this.options.offIcon) {
                this.icon.removeClass(this.options.onIcon).addClass(this.options.offIcon);
            }

            if(!silent) {
                this._trigger('change', null, {checked: false});
            }
        },
        
        disable: function () {
            this.element.prop('disabled', true);
            this.container.attr('aria-disabled', true);
            this.container.addClass('ui-state-disabled').removeClass('ui-state-focus ui-state-hover');
            this._unbindEvents();
        },

        enable: function () {
            this.element.prop('disabled', false);
            this.container.attr('aria-disabled', false);
            this.container.removeClass('ui-state-disabled');
            this._bindEvents();
        },
        
        isChecked: function() {
            return this.element.prop('checked');
        },

        _setOption: function(key, value) {
            if(key === 'checked') {
                this.options.checked = value;
                if(value)
                    this.check(true);
                else
                    this.uncheck(true);
            }
            else if(key === 'disabled') {
                if(value)
                    this.disable();
                else
                    this.enable();
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        _destroy: function() {
            this._unbindEvents();
            this.container.children('span').remove();
            this.element.removeClass('ui-helper-hidden-accessible').unwrap();
        }
        
    });
    
}));
/**
 * PrimeUI Switch Widget
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

    $.widget("primeui.puiswitch", {

        options: {
            onLabel: 'On',
            offLabel: 'Off',
            checked: false,
            change: null,
            enhanced: false
        },

        _create: function() {
            if(!this.options.enhanced) {
                this.element.wrap('<div class="ui-inputswitch ui-widget ui-widget-content ui-corner-all"></div>');
                this.container = this.element.parent();

                this.element.wrap('<div class="ui-helper-hidden-accessible"></div>');
                this.container.prepend('<div class="ui-inputswitch-off"></div>' +
                    '<div class="ui-inputswitch-on ui-state-active"></div>' +
                    '<div class="ui-inputswitch-handle ui-state-default"></div>');

                this.onContainer = this.container.children('.ui-inputswitch-on');
                this.offContainer = this.container.children('.ui-inputswitch-off');
                this.onContainer.append('<span>'+ this.options.onLabel +'</span>');
                this.offContainer.append('<span>'+ this.options.offLabel +'</span>');
            }
            else {
                this.container = this.element.closest('.ui-inputswitch');
                this.onContainer = this.container.children('.ui-inputswitch-on');
                this.offContainer = this.container.children('.ui-inputswitch-off');
            }

            this.onLabel = this.onContainer.children('span');
            this.offLabel = this.offContainer.children('span');
            this.handle = this.container.children('.ui-inputswitch-handle');

            var	onContainerWidth = this.onContainer.width(),
                offContainerWidth = this.offContainer.width(),
                spanPadding	= this.offLabel.innerWidth() - this.offLabel.width(),
                handleMargins = this.handle.outerWidth() - this.handle.innerWidth();

            var containerWidth = (onContainerWidth > offContainerWidth) ? onContainerWidth : offContainerWidth,
                handleWidth = containerWidth;

            this.handle.css({'width':handleWidth});
            handleWidth = this.handle.width();

            containerWidth = containerWidth + handleWidth + 6;

            var labelWidth = containerWidth - handleWidth - spanPadding - handleMargins;

            this.container.css({'width': containerWidth });
            this.onLabel.width(labelWidth);
            this.offLabel.width(labelWidth);

            //position
            this.offContainer.css({ width: this.container.width() - 5 });
            this.offset = this.container.width() - this.handle.outerWidth();

            //default value
            if(this.element.prop('checked')||this.options.checked) {
                this.handle.css({ 'left': this.offset});
                this.onContainer.css({ 'width': this.offset});
                this.offLabel.css({ 'margin-right': -this.offset});
            }
            else {
                this.onContainer.css({ 'width': 0 });
                this.onLabel.css({'margin-left': -this.offset});
            }

            if(!this.element.prop('disabled')) {
                this._bindEvents();
            }
        },

        _bindEvents: function() {
            var $this = this;

            this.container.on('click.puiswitch', function(e) {
                $this.toggle();
                $this.element.trigger('focus');
            });

            this.element.on('focus.puiswitch', function(e) {
                    $this.handle.addClass('ui-state-focus');
                })
                .on('blur.puiswitch', function(e) {
                    $this.handle.removeClass('ui-state-focus');
                })
                .on('keydown.puiswitch', function(e) {
                    var keyCode = $.ui.keyCode;
                    if(e.which === keyCode.SPACE) {
                        e.preventDefault();
                    }
                })
                .on('keyup.puiswitch', function(e) {
                    var keyCode = $.ui.keyCode;
                    if(e.which === keyCode.SPACE) {
                        $this.toggle();

                        e.preventDefault();
                    }
                })
                .on('change.puiswitch', function(e) {
                    if($this.element.prop('checked')||$this.options.checked)
                        $this._checkUI();
                    else
                        $this._uncheckUI();

                    $this._trigger('change', e, {checked: $this.options.checked});
                });
        },

        _unbindEvents: function() {
            this.container.off('click.puiswitch');
            this.element.off('focus.puiswitch blur.puiswitch keydown.puiswitch keyup.puiswitch change.puiswitch');
        },

        _destroy: function() {
            this._unbindEvents();

            if(!this.options.enhanced) {
                this.onContainer.remove();
                this.offContainer.remove();
                this.handle.remove();
                this.element.unwrap().unwrap();
            }
            else {
                this.container.css('width', 'auto');
                this.onContainer.css('width', 'auto');
                this.onLabel.css('width', 'auto').css('margin-left', 0);
                this.offContainer.css('width', 'auto');
                this.offLabel.css('width', 'auto').css('margin-left', 0);
            }
        },

        toggle: function() {
            if(this.element.prop('checked')||this.options.checked)
                this.uncheck();
            else
                this.check();
        },

        check: function() {
            this.options.checked = true;
            this.element.prop('checked', true).trigger('change');
        },

        uncheck: function() {
            this.options.checked = false;
            this.element.prop('checked', false).trigger('change');
        },

        _checkUI: function() {
            this.onContainer.animate({width:this.offset}, 200);
            this.onLabel.animate({marginLeft:0}, 200);
            this.offLabel.animate({marginRight:-this.offset}, 200);
            this.handle.animate({left:this.offset}, 200);
        },

        _uncheckUI: function() {
            this.onContainer.animate({width:0}, 200);
            this.onLabel.animate({marginLeft:-this.offset}, 200);
            this.offLabel.animate({marginRight:0}, 200);
            this.handle.animate({left:0}, 200);
        },

        _setOption: function(key, value) {
            if(key === 'checked') {
                if(value)
                    this.check();
                else
                    this.uncheck();
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
    });

}));
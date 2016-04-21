/**
 * PrimeUI SelectButton Widget
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

    $.widget("primeui.puiselectbutton", {

        options: {
            value: null,
            choices: null,
            formfield: null,
            tabindex: '0',
            multiple: false,
            enhanced: false
        },

        _create: function() {
            if(!this.options.enhanced) {
                this.element.addClass('ui-selectbutton ui-buttonset ui-widget ui-corner-all').attr('tabindex');

                if(this.options.choices) {
                    this.element.addClass('ui-buttonset-' + this.options.choices.length);
                    for(var i = 0; i < this.options.choices.length; i++) {
                        this.element.append('<div class="ui-button ui-widget ui-state-default ui-button-text-only" tabindex="' + this.options.tabindex + '" data-value="'
                            + this.options.choices[i].value + '">' +
                            '<span class="ui-button-text ui-c">' +
                            this.options.choices[i].label +
                            '</span></div>');
                    }
                }
            }
            else {
                var $this = this;
                this.options.choices = [];

                this.element.children('.ui-button').each(function() {
                    var btn = $(this),
                        value = btn.attr('data-value'),
                        label = btn.children('span').text();
                    $this.options.choices.push({'label': label, 'value': value});
                });
            }

            //cornering
            this.buttons = this.element.children('div.ui-button');

            this.buttons.filter(':first-child').addClass('ui-corner-left');
            this.buttons.filter(':last-child').addClass('ui-corner-right');

            if(!this.options.multiple)  {
                this.input = $('<input type="hidden" />').appendTo(this.element);
            }
            else {
                this.input = $('<select class="ui-helper-hidden-accessible" multiple></select>').appendTo(this.element);
                for (var i = 0; i < this.options.choices.length; i++) {
                    var selectOption = '<option value = "'+ this.options.choices[i].value +'"></option>';
                    this.input.append(selectOption);
                }
                this.selectOptions = this.input.children('option');
            }

            if(this.options.formfield) {
                this.input.attr('name', this.options.formfield);
            }

            //preselection
            if(this.options.value !== null && this.options.value !== undefined) {
                this._updateSelection(this.options.value);
            }

            this._bindEvents();
        },

        _destroy: function() {
            this._unbindEvents();
            if(!this.options.enhanced) {
                this.buttons.remove();
                this.element.removeClass('ui-selectbutton ui-buttonset ui-widget ui-corner-all').removeAttr('tabindex');
            }
            else {
                this.buttons.removeClass('ui-state-focus ui-state-hover ui-state-active ui-corner-left ui-corner-right');
            }
            this.input.remove();
        },

        _triggerChangeEvent: function(event) {
            var $this = this;

            if(this.options.multiple) {
                var values = [],
                    indexes = [];
                for(var i = 0; i < $this.buttons.length; i++) {
                    var btn = $this.buttons.eq(i);
                    if(btn.hasClass('ui-state-active')) {
                        values.push(btn.data('value'));
                        indexes.push(i);
                    }
                }

                $this._trigger('change', event, {
                    value: values,
                    index: indexes
                });
            }
            else {
                for(var i = 0; i < $this.buttons.length; i++) {
                    var btn = $this.buttons.eq(i);
                    if(btn.hasClass('ui-state-active')) {
                        $this._trigger('change', event, {
                            value: btn.data('value'),
                            index: i
                        });

                        break;
                    }
                }
            }
        },

        _bindEvents: function() {
            var $this = this;

            this.buttons.on('mouseover.puiselectbutton', function() {
                    var btn = $(this);
                    if(!btn.hasClass('ui-state-active')) {
                        btn.addClass('ui-state-hover');
                    }
                })
                .on('mouseout.puiselectbutton', function() {
                    $(this).removeClass('ui-state-hover');
                })
                .on('click.puiselectbutton', function(e) {
                    var btn = $(this);

                    if($(this).hasClass("ui-state-active")) {
                        $this.unselectOption(btn);
                    }
                    else {
                        if($this.options.multiple) {
                            $this.selectOption(btn);
                        }
                        else {
                            $this.unselectOption(btn.siblings('.ui-state-active'));
                            $this.selectOption(btn);
                        }
                    }

                    $this._triggerChangeEvent(e);
                })
                .on('focus.puiselectbutton', function() {
                    $(this).addClass('ui-state-focus');
                })
                .on('blur.puiselectbutton', function() {
                    $(this).removeClass('ui-state-focus');
                })
                .on('keydown.puiselectbutton', function(e) {
                    var keyCode = $.ui.keyCode;
                    if(e.which === keyCode.SPACE||e.which === keyCode.ENTER||e.which === keyCode.NUMPAD_ENTER) {
                        $(this).trigger('click');
                        e.preventDefault();
                    }
                });
        },

        _unbindEvents: function() {
            this.buttons.off('mouseover.puiselectbutton mouseout.puiselectbutton focus.puiselectbutton blur.puiselectbutton keydown.puiselectbutton click.puiselectbutton');
        },

        selectOption: function(value) {
            var btn = $.isNumeric(value) ? this.element.children('.ui-button').eq(value) : value;

            if(this.options.multiple) {
                this.selectOptions.eq(btn.index()).prop('selected',true);
            }
            else
                this.input.val(btn.data('value'));

            btn.addClass('ui-state-active');
        },

        unselectOption: function(value){
            var btn = $.isNumeric(value) ? this.element.children('.ui-button').eq(value) : value;

            if(this.options.multiple)
                this.selectOptions.eq(btn.index()).prop('selected',false);
            else
                this.input.val('');

            btn.removeClass('ui-state-active');
            btn.removeClass('ui-state-focus');
        },

        _setOption: function (key, value) {
            if (key === 'data') {
                this.element.empty();
                this._bindEvents();
            }
            else if (key === 'value') {
                this._updateSelection(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        _updateSelection: function(value) {
            this.buttons.removeClass('ui-state-active');

            for(var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons.eq(i),
                    buttonValue = button.attr('data-value');

                if(this.options.multiple) {
                    if($.inArray(buttonValue, value) >= 0) {
                        button.addClass('ui-state-active');
                    }
                }
                else {
                    if(buttonValue == value) {
                        button.addClass('ui-state-active');
                        break;
                    }
                }
            }
        }

    });

}));
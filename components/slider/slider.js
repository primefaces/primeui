/**
 * PrimeUI spinner widget
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

    $.widget("primeui.puislider", {

        options: {
            animate: false,
            disabled: false,
            min: 0,
            max: 100,
            orientation: 'horizontal',
            step: null,
            value: null,
            range: false
        },

        _create: function() {
            this.wrapper = this.element,
            disabled = this.wrapper.prop('disabled');

            this.wrapper.addClass('ui-slider ui-widget ui-widget-content ui-corner-all');

            if(this.options.animate) {
                this.wrapper.addClass('ui-slider-animate');
            }

            if(!this.options.range) {
                this.wrapper.append('<span class="ui-slider-handle ui-state-default ui-corner-all"></span>');
                this.sliderHandler = this.wrapper.children('span.ui-slider-handle');
            }

            if (this.options.orientation === 'horizontal') {
                this.wrapper.addClass('ui-slider-horizontal');
            }
            else if (this.options.orientation === 'vertical') {
                this.wrapper.addClass('ui-slider-vertical');
                this.wrapper.append('<span class="ui-slider-range ui-slider-range-min ui-widget-header ui-corner-all"></span>');
                this.verticalSliderHandler = this.wrapper.children('span.ui-slider-range');
            }

            if(this.options.range) {
                this.wrapper.append('<span class="ui-slider-range ui-widget-header ui-corner-all"></span>')
                this.rangeSliderHandler = this.wrapper.children('span.ui-slider-range');
                this.wrapper.append('<span class="ui-slider-handle ui-state-default ui-corner-all">');
                this.wrapper.append('<span class="ui-slider-handle ui-state-default ui-corner-all">');
                this.rangeFirstSliderHandler = this.wrapper.children('span.ui-slider-handle').first();
                this.rangeSecondSliderHandler = this.wrapper.children('span.ui-slider-handle').last();
            }

            this._init();

            if(!disabled) {
                this._bindEvents();
            }

            if(disabled) {
                this.wrapper.addClass('ui-state-disabled');
            }
        },

        _init: function() {
            if(this.options.range) {
                this.handleValues = [];
                this.values = this.options.value || [0,0];
                this.updateHandleValue();
            }
            else {
                this.value = this.options.value || 0;
                this.updateHandleValue(this.value);
            }
        },

        _destroy: function() {
            this.wrapper.off();
            $('body').off('mousemove.puislider mouseup.puislider');
        },

        _bindEvents: function() {
            var $this = this;

            this.wrapper.on('click.puislider', function(e) {
                $this.onBarClick(e);
            });

            if(!this.options.range) {
                this.sliderHandler.on('mousedown.puislider', function(e) {
                    $this.onMouseDown(e);
                });
            }
            else {
                this.rangeFirstSliderHandler.on('mousedown.puislider', function(e) {
                    $this.onMouseDown(e,0);
                });

                this.rangeSecondSliderHandler.on('mousedown.puislider', function(e) {
                    $this.onMouseDown(e,1);
                });
            }


            $('body').on('mousemove.puislider', function(e) {
                if($this.dragging) {
                    $this.handleChange(event);
                    $this.updateHandleValue($this.value);
                }
            });

            $('body').on('mouseup.puislider', function(e) {
                if($this.dragging) {
                    $this.dragging = false;
                    $this._trigger('onSlideEnd', event, {value: this.value});
                }
            });
        },

        onMouseDown: function(event,index) {
            if(this.options.disabled) {
                return;
            }

            this.dragging = true;
            this.updateDomData(event);
            this.sliderHandleClick = true;
            this.handleIndex = index;
            event.target.style.transition="none";
        },

        onBarClick: function(event) {
            if(this.options.disabled) {
                return;
            }

            if(!this.sliderHandleClick) {
                this.updateDomData(event);
                this.handleChange(event);
                this.updateHandleValue(this.value);
            }

            this.sliderHandleClick = false;
        },

        updateDomData: function(event) {
            var rect = this.wrapper[0].getBoundingClientRect();
            this.initX = rect.left + this.getWindowScrollLeft();
            this.initY = rect.top + this.getWindowScrollTop();
            this.barWidth = this.wrapper[0].offsetWidth;
            this.barHeight = this.wrapper[0].offsetHeight;
        },

        handleChange: function(event) {
            var handleValue = this.calculateHandleValue(event);
            var newValue = this.getValueFromHandle(handleValue);

            if(this.options.range) {
                if(this.options.step) {
                    this.handleStepChange(newValue, this.values[this.handleIndex]);
                }
                else {
                    this.handleValues[this.handleIndex] = handleValue;
                    this.updateValue(newValue, event);
                }
            }
            else {
                if(this.options.step) {
                    this.handleStepChange(newValue, this.value);
                }
                else {
                    this.handleValue = handleValue;
                    this.updateValue(newValue, event);
                }
            }
        },

        updateHandleValue: function(value) {
            if(this.options.range) {
                this.handleValues[0] = (this.values[0] < this.options.min ? 0 : this.values[0] - this.options.min) * 100 / (this.options.max - this.options.min);
                this.handleValues[1] = (this.values[1] > this.options.max ? 100 : this.values[1] - this.options.min) * 100 / (this.options.max - this.options.min);
                this.rangeFirstSliderHandler.css('left', this.handleValues[0] + '%');
                this.rangeSecondSliderHandler.css('left', this.handleValues[1] + '%');
                this.rangeSliderHandler.css('width', (this.handleValues[1] - this.handleValues[0] + '%'));
                this.rangeSliderHandler.css('left', this.handleValues[0] + '%');
            }
            else {
                if(value < this.options.min)
                    this.handleValue = 0;
                else if(value > this.options.max)
                    this.handleValue = 100;
                else
                    this.handleValue = (value - this.options.min) * 100 / (this.options.max - this.options.min);

                if(this.options.orientation === 'horizontal') {
                    this.sliderHandler.css('left', this.handleValue + '%');
                }
                else if(this.options.orientation === 'vertical') {
                    this.sliderHandler.css('bottom', this.handleValue + '%');
                    this.verticalSliderHandler.css('height', this.handleValue + '%');
                }

            }
        },

        calculateHandleValue: function(event) {
            if(this.options.orientation === 'horizontal')
                return Math.floor(((event.pageX - this.initX) * 100) / (this.barWidth));
            else
                return Math.floor((((this.initY + this.barHeight) - event.pageY) * 100) / (this.barHeight));
        },

        getValueFromHandle: function(handleValue) {
            return (this.options.max - this.options.min) * (handleValue / 100) + this.options.min;
        },

        handleStepChange: function(newValue, oldValue) {
            var diff = (newValue - oldValue);

            if(diff < 0 && (-1 * diff) >= this.options.step / 2) {
                newValue = oldValue - this.options.step;
                this.updateValue(newValue);
                this.updateHandleValue();
            }
            else if(diff > 0 && diff >= this.options.step / 2) {
                newValue = oldValue + this.options.step;
                this.updateValue(newValue);
                this.updateHandleValue();
            }
        },

        updateValue: function(val, event) {
            if(this.options.range) {
                var value = val;

                if(this.handleIndex == 0) {
                    if(value < this.options.min) {
                        value = this.options.min;
                        this.handleValues[0] = 0;
                    }
                    else if (value > this.values[1]) {
                        value = this.values[1];
                        this.handleValues[0] = this.handleValues[1];
                    }
                }
                else {
                    if(value > this.options.max) {
                        value = this.options.max;
                        this.handleValues[1] = 100;
                    }
                    else if (value < this.values[0]) {
                        value = this.values[0];
                        this.handleValues[1] = this.handleValues[0];
                    }
                }

                this.values[this.handleIndex] = Math.floor(value);
                this._trigger('onChange', event, {values: this.values});
            }
            else {
                if(val < this.options.min) {
                    val = this.options.min;
                    this.handleValue = 0;
                }
                else if (val > this.options.max) {
                    val = this.options.max;
                    this.handleValue = 100;
                }

                this.value = Math.floor(val);
                this._trigger('onChange', event, {value: this.value});
            }
        },

        enable: function() {
            this.wrapper.removeClass('ui-state-disabled');
            this._bindEvents();
        },

        disable: function() {
            this.wrapper.addClass('ui-state-disabled');
            this._unbindEvents();
        },

        getWindowScrollTop: function() {
            var doc = document.documentElement;
            return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        },

        getWindowScrollLeft: function() {
            var doc = document.documentElement;
            return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        },

        _setOption: function(key, value) {
            if(key === 'disabled') {
                if(value)
                    this.disable();
                else
                    this.enable();
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        }
    });

}));

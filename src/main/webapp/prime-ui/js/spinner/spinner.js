/**
 * PrimeUI spinner widget
 */
$(function() {

    $.widget("primeui.puispinner", {
       
        options: {
            step: 1.0
        },
        
        _create: function() {
            var input = this.element,
            disabled = input.prop('disabled');
            
            input.puiinputtext().addClass('pui-spinner-input').wrap('<span class="pui-spinner ui-widget ui-corner-all" />');
            this.wrapper = input.parent();
            this.wrapper.append('<a class="pui-spinner-button pui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n"></span></span></a><a class="pui-spinner-button pui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s"></span></span></a>');
            this.upButton = this.wrapper.children('a.pui-spinner-up');
            this.downButton = this.wrapper.children('a.pui-spinner-down');
            
            this._initValue();
    
            if(!disabled&&!input.prop('readonly')) {
                this._bindEvents();
            }
            
            if(disabled) {
                this.wrapper.addClass('ui-state-disabled');
            }

            //aria
            input.attr({
                'role': 'spinner'
                ,'aria-multiline': false
                ,'aria-valuenow': this.value
            });
            
            if(this.options.min != undefined) 
                input.attr('aria-valuemin', this.options.min);

            if(this.options.max != undefined) 
                input.attr('aria-valuemax', this.options.max);

            if(input.prop('disabled'))
                input.attr('aria-disabled', true);

            if(input.prop('readonly'))
                input.attr('aria-readonly', true);
        },
        

        _bindEvents: function() {
            var $this = this;
            
            //visuals for spinner buttons
            this.wrapper.children('.pui-spinner-button')
                .mouseover(function() {
                    $(this).addClass('ui-state-hover');
                }).mouseout(function() {
                    $(this).removeClass('ui-state-hover ui-state-active');

                    if($this.timer) {
                        clearInterval($this.timer);
                    }
                }).mouseup(function() {
                    clearInterval($this.timer);
                    $(this).removeClass('ui-state-active').addClass('ui-state-hover');
                }).mousedown(function(e) {
                    var element = $(this),
                    dir = element.hasClass('pui-spinner-up') ? 1 : -1;

                    element.removeClass('ui-state-hover').addClass('ui-state-active');

                    if($this.element.is(':not(:focus)')) {
                        $this.element.focus();
                    }

                    $this._repeat(null, dir);

                    //keep focused
                    e.preventDefault();
            });

            this.element.keydown(function (e) {        
                var keyCode = $.ui.keyCode;

                switch(e.which) {            
                    case keyCode.UP:
                        $this._spin($this.options.step);
                    break;

                    case keyCode.DOWN:
                        $this._spin(-1 * $this.options.step);
                    break;

                    default:
                        //do nothing
                    break;
                }
            })
            .keyup(function () { 
                $this._updateValue();
            })
            .blur(function () { 
                $this._format();
            })
            .focus(function () {
                //remove formatting
                $this.element.val($this.value);
            });

            //mousewheel
            this.element.bind('mousewheel', function(event, delta) {
                if($this.element.is(':focus')) {
                    if(delta > 0)
                        $this._spin($this.options.step);
                    else
                        $this._spin(-1 * $this.options.step);

                    return false;
                }
            });
        },

        _repeat: function(interval, dir) {
            var $this = this,
            i = interval || 500;

            clearTimeout(this.timer);
            this.timer = setTimeout(function() {
                $this._repeat(40, dir);
            }, i);

            this._spin(this.options.step * dir);
        },

        _spin: function(step) {
            var newValue = this.value + step;

            if(this.options.min != undefined && newValue < this.options.min) {
                newValue = this.cfg.min;
            }

            if(this.options.max != undefined && newValue > this.options.max) {
                newValue = this.cfg.max;
            }

            this.element.val(newValue).attr('aria-valuenow', newValue);
            this.value = newValue;

            this.element.trigger('change');
        },

        _updateValue: function() {
            var value = this.element.val();

            if(value == '') {
                if(this.options.min != undefined)
                    this.value = this.options.min;
                else
                    this.value = 0;
            }
            else {
                if(this.options.step)
                    value = parseFloat(value);
                else
                    value = parseInt(value);

                if(!isNaN(value)) {
                    this.value = value;
                }
            }
        },

        _initValue: function() {
            var value = this.element.val();

            if(value == '') {
                if(this.options.min != undefined)
                    this.value = this.options.min;
                else
                    this.value = 0;
            }
            else {
                if(this.options.prefix)
                    value = value.split(this.options.prefix)[1];

                if(this.options.suffix)
                    value = value.split(this.options.suffix)[0];

                if(this.options.step)
                    this.value = parseFloat(value);
                else
                    this.value = parseInt(value);
            }
        },

        _format: function() {
            var value = this.value;

            if(this.options.prefix)
                value = this.options.prefix + value;

            if(this.options.suffix)
                value = value + this.options.suffix;

            this.element.val(value);
        }
    });
});
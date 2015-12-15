(function() {

    $.widget("primeui.puiswitch", {
       
       options: {
            onLabel: 'On',
            offLabel: 'Off',
            change: null
        },
        
        _create: function() {
            this.element.wrap('<div class="pui-inputswitch ui-widget ui-widget-content ui-corner-all"></div>');
            this.container = this.element.parent();

            this.element.wrap('<div class="ui-helper-hidden-accessible"></div>');
            this.container.prepend('<div class="pui-inputswitch-off"></div>' + 
                                    '<div class="pui-inputswitch-on ui-state-active"></div>' + 
                                    '<div class="pui-inputswitch-handle ui-state-default"></div>');
            
            this.onContainer = this.container.children('.pui-inputswitch-on');
            this.offContainer = this.container.children('.pui-inputswitch-off');            
            this.onContainer.append('<span>'+ this.options.onLabel +'</span>');
            this.offContainer.append('<span>'+ this.options.offLabel +'</span>');
            this.onLabel = this.onContainer.children('span');
            this.offLabel = this.offContainer.children('span');
            this.handle = this.container.children('.pui-inputswitch-handle');

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

            if(this.element.prop('checked')) {
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
        
            this.container.on('click.inputSwitch', function(e) {
                $this.toggle();
                $this.element.trigger('focus');
            });

            this.element.on('focus.inputSwitch', function(e) {
                $this.handle.addClass('ui-state-focus');
            })
            .on('blur.inputSwitch', function(e) {
                $this.handle.removeClass('ui-state-focus');
            })
            .on('keydown.inputSwitch', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.SPACE) {
                    e.preventDefault();
                }
            })
            .on('keyup.inputSwitch', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.SPACE) {
                    $this.toggle();

                    e.preventDefault();
                }
            })
            .on('change.inputSwitch', function(e) {
                if($this.element.prop('checked'))
                    $this._checkUI();
                else
                    $this._uncheckUI();
                
                $this._trigger('change', e);
            });
        },
        
        toggle: function() {
            if(this.element.prop('checked'))
                this.uncheck();
            else
                this.check();
        },

        check: function() {
            this.element.prop('checked', true).trigger('change');
        },

        uncheck: function() {
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
        }     
    });
    
})();


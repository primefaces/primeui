(function() {

    $.widget("primeui.puiswitch", {
       
       options: {
            onLabel: 'On',
            offLabel: 'Off'
        },
        
        _create: function() {
            //Dom of the switch
            this.element.wrap('<div class="pui-inputswitch ui-widget ui-widget-content ui-corner-all" "></div>');
            this.container = this.element.parent();

            this.element.wrap('<div class="ui-helper-hidden-accessible"></div>');
            this.container.append('<div class="pui-inputswitch-handle ui-state-default " > </div>'+
                                  '<div class="pui-inputswitch-on "></div>'+
                                  '<div class="pui-inputswitch-off "></div>');
            
            $('.pui-inputswitch-on').append('<span>'+ this.options.onLabel +'</span>');
            $('.pui-inputswitch-off').append('<span>'+ this.options.offLabel +'</span>');
 
            this.onLabel = this.container.children('.pui-inputswitch-on');
            this.offLabel = this.container.children('.pui-inputswitch-off');

            this.onContainer = this.element.children('.pui-inputswitch-on');
            //this.onLabel = this.onContainer.children('span');
            this.offContainer = this.element.children('.pui-inputswitch-off');
            //this.offLabel = this.offContainer.children('span');

            this.handle = this.element.children('.pui-inputswitch-handle');
            this.input = $(this.elementId + '_input');

            var onContainerWidth = this.onContainer.width(),
            offContainerWidth = this.offContainer.width(),
            spanPadding = this.offLabel.innerWidth() - this.offLabel.width(),
            handleMargins = this.handle.outerWidth() - this.handle.innerWidth();
            var containerWidth = (onContainerWidth > offContainerWidth) ? onContainerWidth : offContainerWidth,
            handleWidth = containerWidth;

            this.handle.css({'width':handleWidth});
            handleWidth = this.handle.width();

            containerWidth = containerWidth + handleWidth + 6;

            var labelWidth = containerWidth - handleWidth - spanPadding - handleMargins;

            this.element.css({'width': containerWidth });
            this.onLabel.width(labelWidth);
            this.offLabel.width(labelWidth);
            
            //position
            this.offContainer.css({ width: this.element.width() - 5 });
            this.offset = this.element.width() - this.handle.outerWidth();

            if(this.input.prop('checked')) {
                this.handle.css({ 'left': this.offset});
                this.onContainer.css({ 'width': this.offset});
                this.offLabel.css({ 'margin-right': -this.offset});
            }
            else {
                this.onContainer.css({ 'width': 0 });
                this.onLabel.css({'margin-left': -this.offset});
            }
            
            if(!this.input.prop('disabled')) {
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var $this = this;
            this.container.on('mouseover', function() {
                if(!$this.container.hasClass('ui-state-active')) {
                    $this.container.addClass('ui-state-hover');
                }
            }).on('mouseout', function() {
                $this.container.removeClass('ui-state-hover');
            })
            .on('click', function() {
                $this.toggle();
                $this.element.trigger('focus');
            });
            
            this.element.on('focus', function() {            
                $this.container.addClass('ui-state-focus');
            })
            .on('blur', function() {            
                $this.container.removeClass('ui-state-focus');
            })
            .on('keydown', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.SPACE) {
                    e.preventDefault();
                }
            })
            .on('keyup', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.SPACE) {
                    $this.toggle();

                    e.preventDefault();
                }
            });
        },
        _unbindEvents: function() {
            this.container.off('mouseover mouseout click');
            this.element.off('focus blur keydown keyup');
        },
        
        //Functions of switch
        toggle: function() {
            if(this.element.prop('checked'))
                this.uncheck();
            else
                this.check();
            
            this._trigger('change', null, this.element.prop('checked'));
        },

        check: function(silent) {
            this.container.addClass('ui-state-active');
            this.onLabel.prop('checked',true);
        },

        uncheck: function(silent) {
            this.container.removeClass('ui-state-active');
            this.offLabel.prop('checked',false);

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


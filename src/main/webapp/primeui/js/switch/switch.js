(function() {

    $.widget("primeui.puiswitch", {
       
       options: {
            onLabel: 'On',
            offLabel: 'Off'
        },
        
        _create: function() {
            //Dom of the switch
            this.element.wrap('<div class="pui-inputswitch ui-widget ui-widget-content ui-corner-all" style="width: 54px;"></div>');
            this.container = this.element.parent();

            this.element.wrap('<div class="ui-helper-hidden-accessible"></div>');
            this.container.append('<div class="pui-inputswitch-handle ui-state-default " style="width: 24px; left: 0px;"> </div>'+
                                  '<div class="pui-inputswitch-on "></div>'+
                                  '<div class="pui-inputswitch-off "></div>');
            
            $('.pui-inputswitch-on').append('<span>'+ this.options.onLabel +'</span>');
            $('.pui-inputswitch-off').append('<span>'+ this.options.offLabel +'</span>');
 
            this.onLabel = this.container.children('.pui-inputswitch-on');
            this.offLabel = this.container.children('.pui-inputswitch-off');

            //initalization
            if(this.element.prop('checked')) {
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
        }  
    });
    
})();


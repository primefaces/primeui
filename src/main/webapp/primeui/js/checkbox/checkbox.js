/**
 * PrimeUI checkbox widget
 */
$(function() {

    $.widget("primeui.puicheckbox", {
       
        _create: function() {
            this.element.wrap('<div class="pui-chkbox ui-widget"><div class="ui-helper-hidden-accessible"></div></div>');
            this.container = this.element.parent().parent();
            this.box = $('<div class="pui-chkbox-box ui-widget ui-corner-all ui-state-default">').appendTo(this.container);
            this.icon = $('<span class="pui-chkbox-icon pui-c"></span>').appendTo(this.box);
            this.disabled = this.element.prop('disabled');
            this.label = $('label[for="' + this.element.attr('id') + '"]');
            
            if(this.isChecked()) {
                this.box.addClass('ui-state-active');
                this.icon.addClass('ui-icon ui-icon-check');
            }
            
            if(this.disabled) {
                this.box.addClass('ui-state-disabled');
            } else {
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.box.on('mouseover.puicheckbox', function() {
                if(!$this.isChecked())
                    $this.box.addClass('ui-state-hover');
            })
            .on('mouseout.puicheckbox', function() {
                $this.box.removeClass('ui-state-hover');
            })
            .on('click.puicheckbox', function() {
                $this.toggle();
            });
            
            this.element.focus(function() {
                if($this.isChecked()) {
                    $this.box.removeClass('ui-state-active');
                }

                $this.box.addClass('ui-state-focus');
            })
            .blur(function() {
                if($this.isChecked()) {
                    $this.box.addClass('ui-state-active');
                }

                $this.box.removeClass('ui-state-focus');
            })
            .keydown(function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which == keyCode.SPACE) {
                    e.preventDefault();
                }
            })
            .keyup(function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which == keyCode.SPACE) {
                    $this.toggle(true);
                    
                    e.preventDefault();
                }
            });
            
            this.label.on('click.puicheckbox', function(e) {
                $this.toggle();
                e.preventDefault();
            });
        },
        
        toggle: function(keypress) {
            if(this.isChecked()) {
                this.uncheck(keypress);
            } else {
                this.check(keypress);
            }
            
            this._trigger('change', null, this.isChecked());
        },

        isChecked: function() {
            return this.element.prop('checked');
        },

        check: function(activate, silent) {
            if(!this.isChecked()) {
                this.element.prop('checked', true);
                this.icon.addClass('ui-icon ui-icon-check');

                if(!activate) {
                    this.box.addClass('ui-state-active');
                }
                
                if(!silent) {
                    this.element.trigger('change');
                }
            }
        },

        uncheck: function() {
            if(this.isChecked()) {
                this.element.prop('checked', false);
                this.box.removeClass('ui-state-active');
                this.icon.removeClass('ui-icon ui-icon-check');

                this.element.trigger('change');
            }
        },

        _unbindEvents: function() {
            this.box.off();
            this.element.off('focus blur keydown keyup');
            this.label.off();
        },

        disable: function() {
            this.box.prop('disabled', true);

            this.box.attr('aria-disabled', true);
            this.box.addClass('ui-state-disabled').removeClass('ui-state-hover');
            this._unbindEvents();
        },

        enable: function() {
            this.box.prop('disabled', false);
            this.box.attr('aria-disabled', false);
            this.box.removeClass('ui-state-disabled');
            this._bindEvents();
        }
    });
    
});
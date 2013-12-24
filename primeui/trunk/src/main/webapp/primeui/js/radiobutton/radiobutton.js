/**
 * PrimeUI radiobutton widget
 */
$(function() {

    var checkedRadios = {};

    $.widget("primeui.puiradiobutton", {
       
        _create: function() {
            this.element.wrap('<div class="pui-radiobutton ui-widget"><div class="ui-helper-hidden-accessible"></div></div>');
            this.container = this.element.parent().parent();
            this.box = $('<div class="pui-radiobutton-box ui-widget pui-radiobutton-relative ui-state-default">').appendTo(this.container);
            this.icon = $('<span class="pui-radiobutton-icon pui-c"></span>').appendTo(this.box);
            this.disabled = this.element.prop('disabled');
            this.label = $('label[for="' + this.element.attr('id') + '"]');
            
            if(this.element.prop('checked')) {
                this.box.addClass('ui-state-active');
                this.icon.addClass('ui-icon ui-icon-bullet');
                checkedRadios[this.element.attr('name')] = this.box;
            }
            
            if(this.disabled) {
                this.box.addClass('ui-state-disabled');
            } else {
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var $this = this;
        
            this.box.on('mouseover.puiradiobutton', function() {
                if(!$this._isChecked()) 
                    $this.box.addClass('ui-state-hover');
            }).on('mouseout.puiradiobutton', function() {
                if(!$this._isChecked())
                    $this.box.removeClass('ui-state-hover');
            }).on('click.puiradiobutton', function() {
                if(!$this._isChecked()) {
                    $this.element.trigger('click');

                    if($.browser.msie && parseInt($.browser.version, 10) < 9) {
                        $this.element.trigger('change');
                    }
                }
            });
            
            if(this.label.length > 0) {
                this.label.on('click.puiradiobutton', function(e) {
                    $this.element.trigger('click');

                    e.preventDefault();
                });
            }
            
            this.element.focus(function() {
                if($this._isChecked()) {
                    $this.box.removeClass('ui-state-active');
                }

                $this.box.addClass('ui-state-focus');
            })
            .blur(function() {
                if($this._isChecked()) {
                    $this.box.addClass('ui-state-active');
                }

                $this.box.removeClass('ui-state-focus');
            })
            .change(function(e) {
                var name = $this.element.attr('name');
                if(checkedRadios[name]) {
                    checkedRadios[name].removeClass('ui-state-active ui-state-focus ui-state-hover').children('.pui-radiobutton-icon').removeClass('ui-icon ui-icon-bullet');
                }

                $this.icon.addClass('ui-icon ui-icon-bullet');
                if(!$this.element.is(':focus')) {
                    $this.box.addClass('ui-state-active');
                }

                checkedRadios[name] = $this.box;
                
                $this._trigger('change', null);
            });
        },
        
        _isChecked: function() {
            return this.element.prop('checked');
        },

        _unbindEvents: function () {
            this.box.off();

            if (this.label.length > 0) {
                this.label.off();
            }
        },

        enable: function () {
            this._bindEvents();
            this.box.removeClass('ui-state-disabled');
        },

        disable: function () {
            this._unbindEvents();
            this.box.addClass('ui-state-disabled');
        }
    });
    
});
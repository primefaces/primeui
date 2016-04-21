/**
 * PrimeUI radiobutton widget
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

    var checkedRadios = {};

    $.widget("primeui.puiradiobutton", {
       
        _create: function() {
            this.element.wrap('<div class="ui-radiobutton ui-widget"><div class="ui-helper-hidden-accessible"></div></div>');
            this.container = this.element.parent().parent();
            this.box = $('<div class="ui-radiobutton-box ui-widget ui-radiobutton-relative ui-state-default">').appendTo(this.container);
            this.icon = $('<span class="ui-radiobutton-icon"></span>').appendTo(this.box);
            this.disabled = this.element.prop('disabled');
            this.label = $('label[for="' + this.element.attr('id') + '"]');
            
            if(this.element.prop('checked')) {
                this.box.addClass('ui-state-active');
                this.icon.addClass('fa fa-fw fa-circle');
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

                    if(PUI.browser.msie && parseInt(PUI.browser.version, 10) < 9) {
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
            
            this.element.on('focus.puiradiobutton', function() {
                if($this._isChecked()) {
                    $this.box.removeClass('ui-state-active');
                }

                $this.box.addClass('ui-state-focus');
            })
            .on('blur.puiradiobutton', function() {
                if($this._isChecked()) {
                    $this.box.addClass('ui-state-active');
                }

                $this.box.removeClass('ui-state-focus');
            })
            .on('change.puiradiobutton', function(e) {
                var name = $this.element.attr('name');
                if(checkedRadios[name]) {
                    checkedRadios[name].removeClass('ui-state-active ui-state-focus ui-state-hover').children('.ui-radiobutton-icon').removeClass('fa fa-fw fa-circle');
                }

                $this.icon.addClass('fa fa-fw fa-circle');
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
            this.box.off('mouseover.puiradiobutton mouseout.puiradiobutton click.puiradiobutton');
            this.element.off('focus.puiradiobutton blur.puiradiobutton change.puiradiobutton');

            if (this.label.length) {
                this.label.off('click.puiradiobutton');
            }
        },

        enable: function () {
            this._bindEvents();
            this.box.removeClass('ui-state-disabled');
        },

        disable: function () {
            this._unbindEvents();
            this.box.addClass('ui-state-disabled');
        },

        _destroy: function () {
            this._unbindEvents();
            this.container.removeClass('ui-radiobutton ui-widget');
            this.box.remove();
            this.element.unwrap().unwrap();
        }
    });
    
}));
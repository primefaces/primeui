/**
 * PrimeUI Chips Widget
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

    $.widget("primeui.puichips", {
       
        options: {
            value: null,
            name: null,
            field: null,
            onAdd: null,
            onRemove: null,
            template: null,
            style: null,
            styleClass: null,
            disabled: false
        },
        
        _create: function() {
            this._enhance();
            this.value = this.options.value ? this.options.value.slice(0): null;
            this._renderChips();
            
            this._bindEvents();
        },
        
        _enhance: function() {
            this.element.puiinputtext()
                        .wrapAll('<div class="ui-chips ui-widget">' + 
                                    '<ul class="ui-inputtext ui-state-default ui-corner-all">' + 
                                        '<li class="ui-chips-input-token"></li>' + 
                                    '</ul>' + 
                                  '</div>');
            this.list = this.element.parent().parent();
            this.container = this.list.parent();
            this.selectElement = $('<select multiple="multiple" class="ui-helper-hidden"></select>').attr('name', this.options.name).appendTo(this.container);
            
            if(this.options.style) {
                this.container.css(this.options.style);
            }
            if(this.options.styleClass) {
                this.container.addClass(this.options.styleClass);
            }
            
            if(this.options.disabled) {
                this.disable();
            }
        },

        _renderSelectElement: function()  {
           
        },
        
        _renderChips: function() {
            if(this.value) {
                for(var i = 0; i < this.value.length; i++) {
                    this._renderChip(this.value[i]);
                }
            }
        },
        
        _renderChip: function(value) {
            var $this = this;
            var chip = $('<li class="ui-chips-token ui-state-highlight ui-corner-all">' + 
                            '<span class="ui-chips-token-icon fa fa-fw fa-close"></span>' + 
                            '<span class="ui-chips-token-label"></span>' + 
                          '</li>');
            
            chip.children('.ui-chips-token-label').append(this._getChipContent(value));
            chip.children('.ui-chips-token-icon').on('click.puichips', function() {
                $this._removeChip(chip.index());
            });

            var optionValue = this.options.field ? PUI.resolveFieldData(value, this.options.field) : value;
            this.selectElement.append('<option selected="selected">' + value + '</option>');
            
            this.element.parent().before(chip);
        },
        
        _getChipContent: function(value) {
            if(this.options.template)
                return this.options.template(value);
            else
                return this.options.field ? PUI.resolveFieldData(value, this.options.field) : value;
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.element.on('focus.puichips', function() {
                $this.list.addClass('ui-state-focus');
            }).on('blur.puichips', function() {
                $this.list.removeClass('ui-state-focus');
            }).on('keydown.puichips', function(e) {
                if(e.which === 13) {
                    $this._addChip(e.target.value);
                    e.preventDefault();
                }
                else if(e.which === 8) {
                    if(e.target.value === '') {
                        var removeIndex = ($this.value && $this.value.length) ? $this.value.length - 1 : -1;
                        if(removeIndex >= 0) {
                            $this._removeChip(removeIndex);
                        }
                    }
                }
            });
            
            this.container.on('click.puichips', function(e) {
                $this.element.trigger('focus');
            });
        },
        
        _unbindEvents: function() {
            this.element.off('focus.puichips blur.puichips keydown.puichips');
            this.container.off('click.puichips');
        },
        
        _addChip: function(chipValue) {
            this._renderChip(chipValue);
            this.value = this.value||[];
            this.value.push(chipValue);
            this.element.val('');
            this._trigger('onAdd', this.value[chipValue]);
        },
        
        _removeChip: function(index) {
            if(!this.options.disabled) {
                this._trigger('onRemove', this.value[index]);
                this.list.children().eq(index).remove();
                this.selectElement.children().eq(index).remove();
                this.value.splice(index, 1);
            }
        },
        
        getValue: function() {
            return this.value;
        },
        
        setValue: function(value) {
            this.value = value;
            this.list.children('.ui-chips-token').remove();
            this.renderChips();
        },
        
        disable: function() {
            this.list.addClass('ui-state-disabled');
            this.element.prop('disabled', true);
            this._unbindEvents();
        },
        
        enable: function() {
            this.list.removeClass('ui-state-disabled');
            this.element.prop('disabled', true);
            this._bindEvents();
        },
        
        _destroy: function() {
            this._unbindEvents();
            this.element.puiinputtext('destroy').unwrap().unwrap().unwrap();
            this.container.remove();
            this.container = null;
            this.list = null;
            this.value = null;
        }
        
    });
    
}));
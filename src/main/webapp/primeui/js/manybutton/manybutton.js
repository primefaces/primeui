(function() {

    $.widget("primeui.selectmanybutton", {
       
       options: {
            choices: null,
            formfield: null,
            unselectable: false
        },
        
        _create: function() {
            this.element.addClass('pui-selectonebutton pui-buttonset ui-widget ui-corner-all pui-buttonset-3');
            this.select = $('<select name = "'+ this.options.formfield +'"  class="ui-helper-hidden-accessible" multiple></select>').appendTo(this.element);
            for (var i = 0; i < this.options.choices.length; i++) {
                var buttonMarkUp = '<div class = "pui-button ui-widget ui-state-default pui-button-text-only " data-value = "'+ this.options.choices[i].value +'">' +
                                    '<span class = "pui-button-text ui-c">' + this.options.choices[i].label + '</span><input type = "hidden" data-value = "'+ this.options.choices[i].label +'" ></input></div>';
                this.element.append(buttonMarkUp);
                var selectOption = '<option value = "'+ this.options.choices[i].value +'" data-value = "'+ this.options.choices[i].label +'"></option>';
                this.select.append(selectOption);
            }
            this.selectOptions = this.select.children('option');
            var firstChild = $('#xxx .pui-button:first-child');
            var lastChild = $('#xxx .pui-button:last-child');
            firstChild.addClass('ui-corner-left');
            lastChild.addClass('ui-corner-right');
            this.element.children().attr('tabindex', '0');
            this.oneButton = this.element.children(".pui-button");
            this.optionUnselectable = this.options.unselectable;
            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;
            this.element.children().on('mouseover', function() {
                var btn = $(this);
                if(!btn.hasClass('ui-state-active')) {
                   btn.addClass('ui-state-hover');
                }
            })
            .on('mouseout', function() {
                $(this).removeClass('ui-state-hover');
            })
            .on('click', function() {
                var isActive = $(this).hasClass("ui-state-active");
                $this.selectOption($(this));
                if($this.optionUnselectable) {
                    if (isActive)
                        $this.unselectOption($(this), isActive);
                }
            })
            .on('focus', function() {            
                $(this).addClass('ui-state-focus');
            })
            .on('blur', function() {            
                $(this).removeClass('ui-state-focus');
            });  
        },
        selectOption: function(btn) {
            this.selectOptions.eq(btn.index()).prop('selected',true);
            btn.trigger('focus');
            btn.addClass('ui-state-active');
        },
        unselectOption: function(btn){
            this.selectOptions.eq(btn.index()).prop('selected',false);
            btn.removeClass('ui-state-active');
            btn.trigger('blur');  
        }  
    });
    
})();


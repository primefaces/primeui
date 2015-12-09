(function() {

    $.widget("primeui.selectonebutton", {
       
       options: {
            choices: null,
            formfield: null,
            unselectable: false
        },
        
        _create: function() {
            this.element.addClass('pui-selectonebutton pui-buttonset ui-widget ui-corner-all pui-buttonset-3');
            for (var i = 0; i < this.options.choices.length; i++) {
                var buttonMarkUp = '<div class = "pui-button ui-widget ui-state-default pui-button-text-only ui-corner-right" data-value = "'+ this.options.choices[i].value +'">' +
                                    '<span class = "pui-button-text ui-c">' + this.options.choices[i].label + '</span></div>';
                this.element.append(buttonMarkUp);
                var values= this.options.choices[i].value;
                
            }
            
            this.input = $('<input type = "hidden" "></input>').appendTo(this.element);
            this.element.children().attr('tabindex', '0');
            
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
                $this.selectOption($(this));
            })
            .on('focus', function() {            
                $(this).addClass('ui-state-focus');
            })
            .on('blur', function() {            
                $(this).removeClass('ui-state-focus');
            });  
        },
        
        selectOption: function(btn) {
            this.input.val(btn.data('value'));
            btn.trigger('focus');
        }
    });
    
})();


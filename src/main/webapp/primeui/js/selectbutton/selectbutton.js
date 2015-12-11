(function() {

    $.widget("primeui.selectbutton", {
       
       options: {
            choices: null,
            formfield: null,
            unselectable: false,
            tabindex: '0',
            multiple: false
        },
        
        _create: function() {
            this.element.addClass('pui-selectbutton pui-buttonset ui-widget ui-corner-all').attr('tabindex');
            //create buttons
            if(this.options.choices) {
                for(var i = 0; i < this.options.choices.length; i++) {
                    this.element.append('<div class="pui-button ui-widget ui-state-default pui-button-text-only" tabindex="' + this.options.tabindex + '" data-value="' 
                                        + this.options.choices[i].value + '">' +
                                        '<span class="pui-button-text ui-c">' + 
                                        this.options.choices[i].label + 
                                        '</span></div>');
                }
            }
            
            //cornering
            this.buttons = this.element.children('div.pui-button');
            this.buttons.filter(':first-child').addClass('ui-corner-left');
            this.buttons.filter(':last-child').addClass('ui-corner-right');
            
            //Single Select Button Or Multiple Select Button Decision
            if(!(this.options.multiple))  {         
                this.input = $('<input type="hidden"></input>').appendTo(this.element);
            } 
            else {
                this.select = $('<select name = "'+ this.options.formfield +'"  class="ui-helper-hidden-accessible" multiple></select>').appendTo(this.element);
                for (var i = 0; i < this.options.choices.length; i++) {
                    var selectOption = '<option value = "'+ this.options.choices[i].value +'" data-value = "'+ this.options.choices[i].label +'"></option>';
                    this.select.append(selectOption);
                }
                this.selectOptions = this.select.children('option');
            }

            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.buttons.on('mouseover', function() {
                var btn = $(this);
                if(!btn.hasClass('ui-state-active')) {
                    btn.addClass('ui-state-hover');
                }
            })
            .on('mouseout', function() {
                $(this).removeClass('ui-state-hover');
            })
            .on('click', function(e) {
                var btn = $(this);
                if($(this).hasClass("ui-state-active")) {
                    if($this.options.unselectable) {
                        $this.unselectOption(btn);
                        $this._trigger('change', e);
                    }
                }
                else {
                    if($this.options.multiple) {
                        $this.selectOption(btn);
                    }
                    else {
                        $this.unselectOption(btn.siblings('.ui-state-active'));
                        $this.selectOption(btn);
                    } 
                    
                    $this._trigger('change', e);
                }
            })
            .on('focus', function() {            
                $(this).addClass('ui-state-focus');
            })
            .on('blur', function() {            
                $(this).removeClass('ui-state-focus');
            })
            .on('keydown', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.ENTER) {
                    $this.element.trigger('click');
                    e.preventDefault();
                }
            })
            .on('keydown', function(e) {
                var keyCode = $.ui.keyCode;
                if(e.which === keyCode.SPACE||e.which === keyCode.ENTER||e.which === keyCode.NUMPAD_ENTER) {
                    $(this).trigger('click');
                    e.preventDefault();
                }
            });
        },
        
        selectOption: function(value) {
            var btn = $.isNumeric(value) ? this.element.children('.pui-button').eq(value) : value;
            
            if(this.options.multiple) {
                this.selectOptions.eq(btn.index()).prop('selected',true);
            }
            else {
                this.input.val(btn.data('value'));
            }
            btn.addClass('ui-state-active');
        },
        
        unselectOption: function(value){
            var btn = $.isNumeric(value) ? this.element.children('.pui-button').eq(value) : value;
            
            if(this.options.multiple) {
                this.selectOptions.eq(btn.index()).prop('selected',false);
            }
            else {
                this.input.val('');
            }
            btn.removeClass('ui-state-active');   
            btn.removeClass('ui-state-focus');         
        }
        
    });
    
})();


(function() {

    $.widget("primeui.selectonebutton", {
       
       options: {
            choices: null,
            formfield: null,
            unselectable: false,
            tabindex: '0'
        },
        
        _create: function() {
            this.element.addClass('pui-selectonebutton pui-buttonset ui-widget ui-corner-all').attr('tabindex');
            
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
           
            this.input = $('<input type="hidden"></input>').appendTo(this.element);
            
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
            .on('click', function() {
                var btn = $(this);
                
                if($(this).hasClass("ui-state-active")) {
                    if($this.options.unselectable)
                        $this.unselectOption(btn);
                }
                else {
                    $this.unselectOption(btn.siblings('.ui-state-active'));
                    $this.selectOption(btn);
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
            this.input.val(btn.data('value'));
            btn.addClass('ui-state-active');
        },
        
        unselectOption: function(btn){
            this.input.val('');
            btn.removeClass('ui-state-active');            
        }  
        
    });
    
})();


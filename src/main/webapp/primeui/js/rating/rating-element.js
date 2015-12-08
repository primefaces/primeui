xtag.register('p-rating', {
    
    content: '<input type="hidden" />',
    
    accessors: {
        stars: {
            attribute: {}
        },
        cancel: {
            attribute: {}
        },
        readonly: {
            attribute: {}
        },
        disabled: {
            attribute: {}
        }
    },
    
    lifecycle: {
        created: function () {  
            var $this = this,
            onrate = this.getAttribute('onrate'),
            oncancel = this.getAttribute('oncancel')
            options = {
                stars: this.stars,
                cancel: this.cancel,
                readonly: this.readonly !== null,
                disabled: this.disabled !== null
            };
            
            if(onrate !== null) {
                options.rate = function(event, value) {
                    PUI.executeFunctionByName(onrate, window, event, value);
                };
            }
            
            if(oncancel !== null) {
                options.cancel = function(event) {
                    PUI.executeFunctionByName(oncancel, window, event);
                };
            }
            
            $(this).children('input').puirating(options);
        }
    },
    
    events: {
        
        onrate: function() {
            alert('x');
        }
    }
    
});
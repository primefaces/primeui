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
        },
        name: {
            attribute: {}
        }
    },
    
    lifecycle: {
        created: function () {  
            var onrate = this.getAttribute('onrate'),
            oncancel = this.getAttribute('oncancel')
            options = {
                stars: this.stars||5,
                cancel: this.cancel === null ? true : JSON.parse(this.cancel),
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
            
            if(this.name) {
                this.children[0].name = this.name;
            }
            
            $(this.children[0]).puirating(options);
        }
    },
    
    events: {
        
        onrate: function() {
            alert('x');
        }
    }
    
});
xtag.register('p-fieldset', {
            
    accessors: {
        toggleable: {
            attribute: {
                boolean: true
            }
        },
        toggleDuration: {
            attribute: {
                name: 'toggleduration'
            }
        },
        collapsed: {
            attribute: {
                boolean: true
            }
        },
        beforeToggle: {
            attribute: {}
        },
        afterToggle: {
            attribute: {}
        }
    },
    
    lifecycle: {
        
        created: function() {
            var $this = this;
            $(this).contents().wrapAll('<fieldset></fieldset>');
            
            $(this.children[0]).puifieldset({
                toggleable: this.toggleable,
                toggleDuration: this.toggleDuration||'normal',
                collapsed: this.collapsed,
                beforeToggle: this.beforeToggle ? function(event) {PUI.executeFunctionByName($this.beforeToggle, window, event);} : null,
                afterToggle: this.afterToggle ? function(event) {PUI.executeFunctionByName($this.afterToggle, window, event);} : null
            });
        }
        
    },
    
    methods: {
        toggle: function() {
            $(this.children[0]).puifieldset('toggle');
        }
    }
});
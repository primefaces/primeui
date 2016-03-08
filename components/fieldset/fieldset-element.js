if(!xtag.tags['p-fieldset']) {

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
                    beforeToggle: this.beforeToggle ? function(event, collapsed) {PUI.executeFunctionByName($this.beforeToggle, event, collapsed);} : null,
                    afterToggle: this.afterToggle ? function(event, collapsed) {PUI.executeFunctionByName($this.afterToggle, event, collapsed);} : null
                });
            }
        },

        methods: {
            toggle: function() {
                $(this.children[0]).puifieldset('toggle');
            }
        }
        
    });
    
}
if(!xtag.tags['p-switch']) {
 
    xtag.register('p-switch', {
    

        accessors: {
            onlabel: {
                attribute:{}
            },
            offlabel: {
                attribute:{}
            },
            change: {
                attribute:{}
            },
            name: {
                attribute: {}
            },
            checked: {
                attribute: {
                    boolean: true
                }
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.switchel = $('<input type="checkbox" />').appendTo(this);
                $(this.xtag.switchel).puiswitch({
                    onLabel: this.onlabel || 'On',
                    offLabel: this.offlabel || 'Off',
                    change :this.change || null,
                    name: this.name
                });
            }
        },

        methods: {
            toggle: function() {
                $(this).puiswitch('toggle');
            },
            check: function() {
                $(this).puiswitch('check');
            },
            uncheck: function() {
                $(this).puiswitch('uncheck');
            }
        }
        
    });
    
}
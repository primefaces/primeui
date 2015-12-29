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
            },
            renderdelay: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;
                
                if(this.renderdelay) {
                    setTimeout(function() {
                        $this.render();
                    }, parseInt(this.renderdelay));
                }
                else {
                    this.render();
                }
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
            },
            render: function() {
                this.xtag.switchel = $('<input type="checkbox" />').appendTo(this);
                $(this.xtag.switchel).puiswitch({
                    onLabel: this.onlabel || 'On',
                    offLabel: this.offlabel || 'Off',
                    change :this.change || null,
                    name: this.name
                });
            }
        }
        
    });
    
}
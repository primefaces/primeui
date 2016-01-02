if(!xtag.tags['p-switch']) {
 
    xtag.register('p-switch', {
    

        accessors: {
            onlabel: {
                attribute:{}
            },
            offlabel: {
                attribute:{}
            },
            onchange: {
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
                $(this.xtag.input).puiswitch('toggle');
            },
            check: function() {
                $(this.xtag.input).puiswitch('check');
            },
            uncheck: function() {
                $(this.xtag.input).puiswitch('uncheck');
            },
            render: function() {
                var $this = this;
                
                this.xtag.input = $('<input type="checkbox" />').appendTo(this);
                
                if(this.name) {
                    this.xtag.input.attr('name', this.name);
                }
                
                $(this.xtag.input).puiswitch({
                    onLabel: this.onlabel||'On',
                    offLabel: this.offlabel||'Off',
                    change: this.onchange ? function(){PUI.executeFunctionByName($this.onchange);}: null
                });
            }
        }
        
    });
    
}
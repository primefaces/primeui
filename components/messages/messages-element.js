if(!xtag.tags['p-messages']) {
 
    xtag.register('p-messages', {
    
        accessors: {
            closable: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $(this).append('<div></div>').children('div');
                
                $(this.xtag.container).puimessages({
                    closable: this.closable ? JSON.parse(closable): true
                });
            }
        },

        methods: {
            show: function(severity, messages) {
                $(this.xtag.container).puimessages('show', severity, messages);
            },
            clear: function() {
                $(this.xtag.container).puimessages('clear');
            }
        }
        
    });
    
}
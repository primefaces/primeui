if(!xtag.tags['p-terminal']) {
 
    xtag.register('p-terminal', {
    
        accessors: {
            welcomemessage: {
                attribute: {}
            },
            prompt: {
                attribute: {}
            },
            handler: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $(this).append('<div></div>').children('div');
                        
                $(this.xtag.container).puiterminal({
                    welcomeMessage: this.welcomemessage||'',
                    prompt: this.prompt||'prime $',
                    handler: PUI.resolveObjectByName(this.handler)                    
                });
            }
        },

        methods: {
            disable: function() {
                $(this).puiinputtext('disable');
            },
            enable: function() {
                $(this).puiinputtext('enable');
            }
        }
        
    });
    
}
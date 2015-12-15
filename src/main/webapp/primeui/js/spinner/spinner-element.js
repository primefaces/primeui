if(!xtag.tags['p-spinner']) {
 
    xtag.register('p-spinner', {

        accessors: {
            step:{
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.spinner = $('<input type="text" />').appendTo(this);
                
                $(this.xtag.spinner).puispinner({
                    step: this.step || 1.0
                });
            }
        },

        methods: {
            disable: function() {
                $(this).puispinner('disable');
            },
            enable: function() {
                $(this).puispinner('enable');
            }
        }
        
    });
    
}
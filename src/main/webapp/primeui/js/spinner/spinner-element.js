if(!xtag.tags['p-spinner']) {
 
    xtag.register('p-spinner', {

        extends: 'input',

        accessors: {
            step:{
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                $(this).puispinner({
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
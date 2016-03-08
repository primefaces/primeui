if(!xtag.tags['p-spinner']) {
 
    xtag.register('p-spinner', {

        extends: 'input',

        accessors: {
            step:{
                attribute:{}
            },
            min:{
                attribute:{}
            },
            max:{
                attribute:{}
            },
            prefix:{
                attribute:{}
            },
            suffix:{
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                $(this).puispinner({
                    step: this.step||1.0,
                    min: this.min !== null ? parseInt(this.min) : undefined,
                    max: this.max !== null ? parseInt(this.max) : undefined,
                    prefix: this.prefix,
                    suffix: this.suffix
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
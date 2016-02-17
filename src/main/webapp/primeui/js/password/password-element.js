if(!xtag.tags['p-password']) {
 
    xtag.register('p-password', {

        extends: 'input',

        accessors: {
            promptLabel:{
                attribute:{}
            },
            weakLabel:{
                attribute:{}
            },
            mediumLabel:{
                attribute:{}
            },
            strongLabel:{
                attribute:{}
            },
            inline:{
                attribute:{
                    boolean:true
                }
            }
        },

        lifecycle: {
            created: function() {
                $(this).puipassword({
                    promptLabel: this.promptLabel || 'Please enter a password',
                    weakLabel: this.weakLabel || 'Weak',
                    mediumLabel: this.mediumLabel || 'Medium',
                    strongLabel: this.strongLabel || 'Strong',
                    inline: this.inline || false,
                });
            }
        },

        methods: {
            disable: function() {
                $(this).puipassword('disable');
            },
            enable: function() {
                $(this).puipassword('enable');
            },
            align: function() {
                $(this).puipassword('align');
            },
            show: function() {
                $(this).puipassword('show');
            },
            hide: function() {
                $(this).puipassword('hide');
            }
        }
        
    });
    
}
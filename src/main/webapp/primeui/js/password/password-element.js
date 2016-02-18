if(!xtag.tags['p-password']) {
 
    xtag.register('p-password', {

        extends: 'input',

        accessors: {
            promptlabel:{
                attribute:{}
            },
            weaklabel:{
                attribute:{}
            },
            mediumlabel:{
                attribute:{}
            },
            stronglabel:{
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
                    promptLabel: this.promptlabel||'Please enter a password',
                    weakLabel: this.weaklabel||'Weak',
                    mediumLabel: this.mediumlabel||'Medium',
                    strongLabel: this.stronglabel||'Strong',
                    inline: this.inline
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
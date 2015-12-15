if(!xtag.tags['p-password']) {
 
    xtag.register('p-password', {

        accessors: {
            promptLabel:{
                attribute:{}
            },
            weakLabel:{
                attribute:{}
            },
            goodLabel:{
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
                this.xtag.password = $('<input type="text" />').appendTo(this);

                $(this.xtag.password).puipassword({
                    promptLabel: this.promptLabel || 'Please enter a password',
                    weakLabel: this.weakLabel || 'Weak',
                    goodLabel: this.goodLabel || 'Medium',
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
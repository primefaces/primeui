if(!xtag.tags['p-inputtext']) {
 
    xtag.register('p-inputtext', {
    
        extends: 'input',

        accessors: {
        },

        lifecycle: {
            created: function() {
                $(this).puiinputtext();
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
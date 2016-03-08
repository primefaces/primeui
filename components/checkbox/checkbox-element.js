if(!xtag.tags['p-checkbox']) {
 
    xtag.register('p-checkbox', {
    
        extends: 'input',

        lifecycle: {
            created: function() {
                $(this).puicheckbox();
            }
        }
        
    });
    
}
if(!xtag.tags['p-radiobutton']) {
 
    xtag.register('p-radiobutton', {
    
        extends: 'input',

        lifecycle: {
            created: function() {
                $(this).puiradiobutton();
            }
        }
        
    });
    
}
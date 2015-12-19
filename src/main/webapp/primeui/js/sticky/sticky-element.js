if(!xtag.tags['p-sticky']) {

    xtag.register('p-sticky', {

        accessors: {
            target: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                $(document.getElementById(this.target)).puisticky();
            }
        }
        
    });

}
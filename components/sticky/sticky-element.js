if(!xtag.tags['p-sticky']) {

    xtag.register('p-sticky', {

        accessors: {
            target: {
                attribute: {}
            },
            renderdelay: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;
                
                if(this.renderdelay) {
                    setTimeout(function() {
                        $this.render();
                    }, parseInt(this.renderdelay));
                }
                else {
                    this.render();
                }
            }
        },
        methods: {
            render: function() {
                $(document.getElementById(this.target)).puisticky();
            }
        }
        
    });

}
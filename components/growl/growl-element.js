if(!xtag.tags['p-growl']) {
 
    xtag.register('p-growl', {
    
        accessors: {
            sticky: {
                attribute:{
                    boolean: true
                }
            },
            life: {
                attribute:{}
            },
            appendto: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.growl = $(this).append('<div></div>').children('div');

                $(this.xtag.growl).puigrowl({
                    life: this.life||3000,
                    sticky: this.sticky,
                    appendTo: this.appendTo ? document.getElementById(this.appendto) : undefined
                });
            }
        },

        methods: {
            show: function(messages) {
                $(this.xtag.growl).puigrowl('show', messages);
            },
            clear: function() {
                $(this.xtag.growl).puigrowl('clear');
            }
        }    
    });
    
}
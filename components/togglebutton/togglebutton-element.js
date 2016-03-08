if(!xtag.tags['p-togglebutton']) {
 
    xtag.register('p-togglebutton', {
    
        accessors: {
            onlabel: {
                attribute:{}
            },
            offlabel: {
                attribute:{}
            },
            onicon: {
                attribute:{}
            },
            officon: {
                attribute:{}
            },
            onchange: {
                attribute: {}
            },
            name: {
                attribute: {}
            },
            checked: {
                attribute: {
                    boolean: true
                }
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.checkbox = $('<input type="checkbox" />').appendTo(this);
                
                if(this.name) {
                    this.xtag.checkbox.attr('name', this.name);
                }
                
                if(this.onchange) {
                    this.xtag.checkbox.attr('onchange', this.onchange);
                }
                
                if(this.checked) {
                    this.xtag.checkbox.prop('checked', true);
                }
                
                $(this.xtag.checkbox).puitogglebutton({
                    onLabel: this.onlabel,
                    offLabel: this.offlabel,
                    onIcon: this.onicon,
                    offIcon: this.officon
                });
            }
        },

        methods: {
            disable: function() {
                $(this.xtag.checkbox).puitogglebutton('disabled');
            },
            enable: function() {
               $(this.xtag.checkbox).puitogglebutton('enable');
            },
            toggle: function() {
                $(this.xtag.checkbox).puitogglebutton('toggle');
            },
            check: function() {
               $(this.xtag.checkbox).puitogglebutton('uncheck');
            },
            uncheck: function() {
               $(this.xtag.checkbox).puitogglebutton('check');
            },
            isChecked: function() {
               $(this.xtag.checkbox).puitogglebutton('isChecked');
            }
        }
        
    });
    
}
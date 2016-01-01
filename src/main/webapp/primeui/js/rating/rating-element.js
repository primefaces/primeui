if(!xtag.tags['p-rating']) {

    xtag.register('p-rating', {

        content: '<input type="hidden" />',

        accessors: {
            stars: {
                attribute: {}
            },
            cancel: {
                attribute: {}
            },
            readonly: {
                attribute: {
                    boolean: true
                }
            },
            disabled: {
                attribute: {
                    boolean: true
                }
            },
            name: {
                attribute: {}
            },
            onrate: {
                attribute: {}
            },
            oncancel: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function () {  
                var $this = this,
                options = {
                    stars: this.stars||5,
                    cancel: this.cancel ? JSON.parse(this.cancel) : true,
                    readonly: this.readonly,
                    disabled: this.disabled,
                    rate: this.onrate ? function(event, value){PUI.executeFunctionByName($this.onrate, event, value);} : null,
                    oncancel: this.oncancel ? function(event, value){PUI.executeFunctionByName($this.oncancel);} : null
                };

                if(this.name) {
                    this.children[0].name = this.name;
                }

                $(this.children[0]).puirating(options);
            }
        },
        
        methods: {
            getValue: function() {
                return $(this.children[0]).puirating('getValue');
            },
            setValue: function(value) {
                $(this.children[0]).puirating('setValue', value);
            },
            cancel: function() {
                $(this.children[0]).puirating('cancel');
            },
            enable: function() {
                $(this.children[0]).puirating('enable');
            },
            disable: function() {
                $(this.children[0]).puirating('disable');
            }
        }
        
    });

}
if(!xtag.tags['p-textarea']) {

    xtag.register('p-textarea', {

        extends: 'textarea',

        accessors: {
            autoresize: {
                attribute: {
                    boolean: true
                }
            },
            autosuggest: {
                attribute: {
                    boolean: true
                }
            },
            counter: {
                attribute: {}
            },
            countertemplate: {
                attribute: {}
            },
            minquerylength: {
                attribute: {}
            },
            querydelay: {
                attribute: {}
            },
            onitemselect: {
                attribute: {}
            },
            completemethod: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;

                $(this).puiinputtextarea({
                    autoResize: this.autoresize,
                    autoComplete: this.autosuggest,
                    maxlength: this.maxlength,
                    counter: this.counter ? $('#' + this.counter) : null,
                    counterTemplate: this.countertemplate||'{0}',
                    minQueryLength: this.minquerylength||3,
                    queryDelay: this.querydelay||700,
                    itemselect: this.onitemselect ? function(event, item) {PUI.executeFunctionByName($this.onitemselect, event, item);} : null,
                    completedMethod: this.completemethod ? PUI.resolveObjectByName(this.completemethod) : null
                });
            }
        },

        methods: {
            enable: function() {
                $(this).puiinputtextarea('enable');
            },
            disable: function() {
                $(this).puiinputtextarea('disable');
            }
        }
        
    });

}
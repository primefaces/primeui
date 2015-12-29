if(!xtag.tags['p-autocomplete']) {

    xtag.register('p-autocomplete', {

        extends: 'input',

        accessors: {
            completesource: {
                attribute: {}
            },
            delay: {
                attribute: {}
            },
            minquerylength: {
                attribute: {}
            },
            multiple: {
                attribute: {
                    boolean: true
                }
            },
            dropdown: {
                attribute: {
                    boolean: true
                }
            },
            scrollheight: {
                attribute: {}
            },
            forceselection: {
                attribute: {
                    boolean: true
                }
            },
            effect: {
                attribute: {}
            },
            effectspeed: {
                attribute: {}
            },
            content: {
                attribute: {}
            },
            casesensitive: {
                attribute: {
                    boolean: true
                }
            },
            onselect: {
                attribute: {}
            },
            onunselect: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;

                $(this).puiautocomplete({
                    completeSource: this.completesource ? PUI.resolveObjectByName(this.completesource): null,
                    delay: this.delay||300,
                    minQueryLength: this.minQueryLength||1,
                    multiple: this.multiple,
                    dropdown: this.dropdown,
                    scrollHeight: this.scrollheight||200,
                    forceSelection: this.forceselection,
                    effect: this.effect,
                    effectSpeed: this.effectspeed||'normal',
                    caseSensitive: this.casesensitive,
                    select: this.onselect ? function(event, item){PUI.executeFunctionByName($this.onselect, event, item);} : null,
                    unselect: this.onunselect ? function(event, item){PUI.executeFunctionByName($this.onunselect, event, item);} : null,
                });
            }
        }
        
    });
    
}
if(!xtag.tags['p-listbox']) {
 
    xtag.register('p-listbox', {
    
        accessors: {
            multiple: {
                attribute: {
                    boolean: true
                }
            },
            name: {
                attribute: {}
            },
            style: {
                attribute: {}
            },
            styleclass: {
                attribute: {}
            },
            onitemselect: {
                attribute: {}
            },
            onitemunselect: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this),
                $this = this;
        
                element.children('option').wrapAll('<select></select>');
                this.xtag.select = element.children('select');
                if(this.name) {
                    this.xtag.select.attr('name', this.name);
                }
                
                var itemTemplate = element.children('template');
                
                this.xtag.select.puilistbox({
                    multiple: this.multiple,
                    template: itemTemplate.length ? itemTemplate : null,
                    style: this.style,
                    styleClass: this.styleclass,
                    itemSelect: this.onitemselect ? function(event, option) {PUI.executeFunctionByName($this.onitemselect, event);} : null,
                    itemUnselect: this.onitemunselect ? function(event, option) {PUI.executeFunctionByName($this.onitemunselect, event);} : null
                });
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
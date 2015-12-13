if(!xtag.tags['p-panel']) {

    xtag.register('p-panel', {

        accessors: {
            toggleable: {
                attribute: {
                    boolean: true
                }
            },
            toggleDuration: {
                attribute: {
                    name: 'toggleduration'
                }
            },
            toggleOrientation: {
                attribute: {
                    name: 'toggleorientation'
                }
            },
            collapsed: {
                attribute: {
                    boolean: true
                }
            },
            closable: {
                attribute: {
                    boolean: true
                }
            },
            closeDuration: {
                attribute: {
                    name: 'closeduration'
                }
            },
            title: {
                attribute: {}
            },
            onbeforeclose: {
                attribute: {}
            },
            onafterclose: {
                attribute: {}
            },
            onbeforecollapse: {
                attribute: {}
            },
            onaftercollapse: {
                attribute: {}
            },
            onbeforeexpand: {
                attribute: {}
            },
            onafterexpand: {
                attribute: {}
            }
        },

        lifecycle: {

            created: function() {
                var $this = this,
                options = {
                    title: this.title,
                    toggleable: this.toggleable,
                    toggleDuration: this.toggleDuration||'normal',
                    toggleOrientation: this.toggleOrientation||'vertical',
                    collapsed: this.collapsed,
                    closable: this.closable,
                    closeDuration: this.closeDuration||'slow'
                };

                if(this.beforeClose) options.beforeClose = function(event) {PUI.executeFunctionByName($this.onbeforeclose, event);};
                if(this.afterClose) options.afterClose = function(event) {PUI.executeFunctionByName($this.onafterclose, event);};
                if(this.beforeCollapse) options.beforeCollapse = function(event) {PUI.executeFunctionByName($this.onbeforecollapse, event);};
                if(this.afterCollapse) options.afterCollapse = function(event) {PUI.executeFunctionByName($this.onaftercollapse, event);};
                if(this.beforeExpand) options.beforeExpand = function(event) {PUI.executeFunctionByName($this.onbeforeexpand, event);};
                if(this.afterExpand) options.afterExpand = function(event) {PUI.executeFunctionByName($this.onafterexpand, event);};

                $(this).contents().wrapAll('<div></div>');
                $(this.children[0]).puipanel(options);
            }
        }

    });

}
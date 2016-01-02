if(!xtag.tags['p-treeicon']) {
 
    xtag.register('p-treeicon', {
    
        accessors: {
            type: {
                attribute:{}
            },
            expanded: {
                attribute:{}
            },
            collapsed: {
                attribute:{}
            },
            value: {
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                
            }
        }
        
    });
    
}

if(!xtag.tags['p-tree']) {
 
    xtag.register('p-tree', {
    
        accessors: {
            nodes: {
                attribute:{}
            },
            lazy: {
                attribute:{
                    boolean: true
                }
            },
            animate: {
                attribute:{
                    boolean: true
                }
            },
            selectionmode: {
                attribute:{}
            },
            onnodeselect: {
                attribute: {}
            },
            onnodeunselect: {
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
                var element = $(this),
                treeIconElements = element.children('p-treeicon'),
                treeIcons = null,
                $this = this;
                
                this.xtag.container = $(this).append('<div></div>').children('div');
                
                if(treeIconElements.length) {
                    treeIcons = {}; 
                
                    for(var i = 0; i < treeIconElements.length; i++) {
                        var treeIcon = treeIconElements.eq(i),
                        value = treeIcon.attr('value');

                        if(value) {
                            treeIcons[treeIcon.attr('type')] = value;
                        }
                        else {
                            treeIcons[treeIcon.attr('type')] = {
                                expanded: treeIcon.attr('expanded'),
                                collapsed: treeIcon.attr('collapsed')
                            };
                        }
                    }
                } 
                
                $(this.xtag.container).puitree({
                    nodes: PUI.resolveObjectByName(this.nodes),
                    lazy: this.lazy,
                    animate: this.animate,
                    selectionMode: this.selectionmode,
                    icons: treeIcons,
                    nodeSelect: this.onnodeselect ? function(event, ui) {PUI.executeFunctionByName($this.onnodeselect, event, ui);} : null,
                    nodeUnselect: this.onnodeunselect ? function(event, ui) {PUI.executeFunctionByName($this.onnodeunselect, event, ui);} : null,
                    beforeCollapse: this.onbeforecollapse ? function(event, ui) {PUI.executeFunctionByName($this.onbeforecollapse, event, ui);} : null,
                    afterCollapse: this.onaftercollapse ? function(event, ui) {PUI.executeFunctionByName($this.onaftercollapse, event, ui);} : null,
                    beforeExpand: this.onbeforeexpand ? function(event, ui) {PUI.executeFunctionByName($this.onbeforeexpand, event, ui);} : null,
                    afterExpand: this.onafterexpand ? function(event, ui) {PUI.executeFunctionByName($this.onafterexpand, event, ui);} : null
                });
            }
        },

        methods: {
            expandNode: function(node) {
                $(this.xtag.container).puitree('expandNode', node);
            },
            collapseNode: function(node) {
                $(this.xtag.container).puitree('collapseNode', node);
            },
            selectNode: function(node) {
                $(this.xtag.container).puitree('selectNode', node);
            },
            unselectNode: function(node) {
                $(this.xtag.container).puitree('unselectNode', node);
            },
            unselectAllNodes: function(node) {
                $(this.xtag.container).puitree('unselectAllNodes');
            }
        }
        
    });
    
}
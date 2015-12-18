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
            icons: {
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $(this).append('<div></div>').children('div');
                
                $(this.xtag.container).puitree({
                    nodes: PUI.resolveObjectByName(this.nodes),
                    lazy: this.lazy,
                    animate: this.animate,
                    selectionMode: this.selectionmode
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
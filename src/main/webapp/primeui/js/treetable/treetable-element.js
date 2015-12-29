if(!xtag.tags['p-treetable']) {
 
    xtag.register('p-treetable', {
    
        accessors: {
            nodes: {
                attribute: {}
            },
            lazy: {
                attribute: {
                    boolean: true
                }
            },
            selectionmode: {
                attribute: {}
            },
            header: {
                attribute: {}
            },
            onbeforeexpand: {
                attribute: {}
            },
            onafterexpand: {
                attribute: {}
            },
            onbeforecollapse: {
                attribute: {}
            },
            onaftercollapse: {
                attribute: {}
            },
            onnodeselect: {
                attribute: {}
            },
            onnodeunselect: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this),
                columnElements = element.children('p-column'),
                cols = [],
                $this = this;
        
                this.xtag.container = $(this).append('<div></div>').children('div');
                
                for(var i = 0; i < columnElements.length; i++) {
                    var col = {},
                    columnElement = columnElements.eq(i);
            
                    col.field = columnElement.attr('field');
                    col.headerText = columnElement.attr('headertext');
                    col.footerText = columnElement.attr('footertext');
                    col.sortable = columnElement.prop('sortable')  !== undefined;
                    col.headerStyle = columnElement.attr('headerstyle');
                    col.headerClass = columnElement.attr('headerclass');
                    col.bodyStyle = columnElement.attr('bodystyle');
                    col.bodyClass = columnElement.attr('bodyclass');
                    col.colspan = columnElement.attr('colspan');
                    col.rowspan = columnElement.attr('rowspan');

                    cols.push(col);
                }
                
                $(this.xtag.container).puitreetable({
                    columns: cols,
                    nodes: PUI.resolveObjectByName(this.nodes),
                    lazy: this.lazy,
                    header: this.header,
                    selectionMode: this.selectionmode,
                    beforeExpand: this.onbeforeexpand ? function(event, ui) {PUI.executeFunctionByName($this.onbeforeexpand, event, ui);} : null,
                    afterExpand: this.onafterexpand ? function(event, ui) {PUI.executeFunctionByName($this.onbeforeexpand, event, ui);} : null,
                    beforeCollapse: this.onbeforecollapse ? function(event, ui) {PUI.executeFunctionByName($this.onbeforecollapse, event, ui);} : null,
                    afterCollapse: this.onaftercollapse ? function(event, ui) {PUI.executeFunctionByName($this.onaftercollapse, event, ui);} : null,
                    nodeSelect: this.onnodeselect ? function(event, ui) {PUI.executeFunctionByName($this.onnodeselect, event, ui);} : null,
                    nodeUnselect: this.onnodeunselect ? function(event, ui) {PUI.executeFunctionByName($this.onnodeunselect, event, ui);} : null
                });
            }
        }
        
    });
    
}
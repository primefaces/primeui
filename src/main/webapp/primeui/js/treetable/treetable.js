/**
 * PrimeUI TreeTable widget
 */
$(function() {

    $.widget("primeui.puitreetable", {
       
        options: {
             nodes: null,
             lazy: false,
             selectionMode: null
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            this.element.addClass('pui-treetable ui-widget');
            this.tableWrapper = $('<div class="pui-treetable-tablewrapper" />').appendTo(this.element);
            this.table = $('<table><thead></thead><tbody></tbody></table>').appendTo(this.tableWrapper);
            this.thead = this.table.children('thead');
            this.tbody = this.table.children('tbody').addClass('pui-treetable-data');
            
            var $this = this;
            
            if(this.options.columns) {
                $.each(this.options.columns, function(i, col) {
                    var header = $('<th class="ui-state-default"></th>').data('field', col.field).appendTo($this.thead);
                    
                    if(col.headerClass) {
                        header.addClass(col.headerClass);
                    } 
                    
                    if(col.headerStyle) {
                        header.attr('style', col.headerStyle);
                    }
                    
                    if(col.headerText) {
                        header.text(col.headerText);
                    }
                });
            }
            
            if(this.options.header) {
                this.element.prepend('<div class="pui-treetable-header ui-widget-header">' + this.options.caption + '</div>');
            }
            
            if(this.options.footer) {
                this.element.append('<div class="pui-treetable-footer ui-widget-header">' + this.options.caption + '</div>');
            }
            
            if(this.options.selectionMode) {
                //this._initSelection();
            }
            
            if($.isArray(this.options.nodes)) {
                this._renderNodes(this.options.nodes, null);
            }
            else if($.type(this.options.nodes) === 'function') {
                this.options.nodes.call(this, {}, this._initData);
            }
            else {
                throw 'Unsupported type. nodes option can be either an array or a function';
            }
        },
                
        _renderNodes: function(nodes, rootRow) {
            for(var i = 0; i < nodes.length; i++) {
                var node = nodes[i],
                nodeData = node.data,
                leaf = !node.children||node.children.length === 0,
                row = $('<tr class="ui-widget-content"></tr>'),
                depth = rootRow ? rootRow.data('depth') + 1 : 0;
                
                row.data('depth', depth);
                
                for(var j = 0; j < this.options.columns.length; j++) {
                    var column = $('<td />').appendTo(row),
                    columnOptions = this.options.columns[j];

                    if(columnOptions.bodyClass) {
                        column.addClass(columnOptions.bodyClass);
                    } 

                    if(columnOptions.bodyStyle) {
                        column.attr('style', columnOptions.bodyStyle);
                    }
                    
                    if(j === 0) {
                        var toggler = $('<span class="pui-treetable-toggler ui-icon ui-icon-triangle-1-e ui-c"></span>');
                        
                        toggler.css('margin-left', depth * 16 + 'px');
                        if(leaf) {
                            toggler.css('visibility', 'hidden');
                        }
                        
                        toggler.appendTo(column);
                    }

                    if(columnOptions.content) {
                        var content = columnOptions.content.call(this, nodeData);
                        if($.type(content) === 'string')
                            column.text(content);
                        else
                            column.append(content);
                    }
                    else {
                        column.append(nodeData[columnOptions.field]);
                    }     
                }
                
                if(rootRow)
                    row.insertAfter(rootRow);
                else
                    row.appendTo(this.tbody);
                
                if(!leaf) {
                    this._renderNodes(node.children, row);
                }
            }
        }
    });
    
});
            
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
                this.element.prepend('<div class="pui-treetable-header ui-widget-header ui-corner-top">' + this.options.header + '</div>');
            }
            
            if(this.options.footer) {
                this.element.append('<div class="pui-treetable-footer ui-widget-header ui-corner-bottom">' + this.options.footer + '</div>');
            }
            
            if($.isArray(this.options.nodes)) {
                this._renderNodes(this.options.nodes, null, true);
            }
            else if($.type(this.options.nodes) === 'function') {
                this.options.nodes.call(this, {}, this._initData);
            }
            else {
                throw 'Unsupported type. nodes option can be either an array or a function';
            }
            
            this._bindEvents();
        },
        
        _initData: function(data) {
            this._renderNodes(data, null, true);       
        },
                
        _renderNodes: function(nodes, rootRow, expanded) {
            for(var i = 0; i < nodes.length; i++) {
                var node = nodes[i],
                nodeData = node.data,
                leaf = this.options.lazy ? node.leaf : !(node.children && node.children.length),
                row = $('<tr class="ui-widget-content"></tr>'),
                depth = rootRow ? rootRow.data('depth') + 1 : 0,
                parentRowkey = rootRow ? rootRow.data('rowkey'): null,
                rowkey = parentRowkey ? parentRowkey + '_' + i : i.toString();
                        
                row.data({
                   'depth': depth, 
                   'rowkey': rowkey,
                   'parentrowkey': parentRowkey,
                   'puidata': nodeData,
                });
                
                if(!expanded) {
                    row.addClass('ui-helper-hidden');
                }
                
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
                        var toggler = $('<span class="pui-treetable-toggler pui-icon fa fa-fw fa-caret-right"></span>');
                        
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
                    this._renderNodes(node.children, row, node.expanded);
                }
            }
        },
        
        _bindEvents: function() {
            var $this = this,
            togglerSelector = '> tr > td:first-child > .pui-treetable-toggler';

            //expand and collapse
            this.tbody.off('click.puitreetable', togglerSelector)
                        .on('click.puitreetable', togglerSelector, null, function(e) {
                            var toggler = $(this),
                            row = toggler.closest('tr');

                            if(!row.data('processing')) {
                                row.data('processing', true);

                                if(toggler.hasClass('fa-caret-right'))
                                    $this.expandNode(row);
                                else
                                    $this.collapseNode(row);
                            }
                        });
                        
            //selection
            if(this.options.selectionMode) {
                this.selection = [];
                var rowSelector = '> tr';
        
                this.tbody.off('mouseover.puitreetable mouseout.puitreetable click.puitreetable', rowSelector)
                    .on('mouseover.puitreetable', rowSelector, null, function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-highlight')) {
                            element.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.puitreetable', rowSelector, null, function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-highlight')) {
                            element.removeClass('ui-state-hover');
                        }
                    })
                    .on('click.puitreetable', rowSelector, null, function(e) {
                        $this.onRowClick(e, $(this));
                    });
            }
        },
        
        expandNode: function(row) {
            this._trigger('beforeExpand', null, {'node': row, 'data': row.data('puidata')});
    
            if(this.options.lazy && !row.data('puiloaded')) {
                this.options.nodes.call(this, {
                    'node': row,
                    'data': row.data('puidata')
                }, this._handleNodeData);
            }
            else {
                this._showNodeChildren(row, false);
                this._trigger('afterExpand', null, {'node': row, 'data': row.data('puidata')});
            }
        },
        
        _handleNodeData: function(data, node) {
            this._renderNodes(data, node, true);    
            this._showNodeChildren(node, false);
            node.data('puiloaded', true);
            this._trigger('afterExpand', null, {'node': node, 'data': node.data('puidata')});
        },
        
        _showNodeChildren: function(row, showOnly) {
            if(!showOnly) {
                row.data('expanded', true).attr('aria-expanded', true)
                        .find('.pui-treetable-toggler:first').addClass('fa-caret-down').removeClass('fa-caret-right');
            }
            
            var children = this._getChildren(row);
            for(var i = 0; i < children.length; i++) {
                var child = children[i];
                child.removeClass('ui-helper-hidden');
                    
                if(child.data('expanded')) {
                    this._showNodeChildren(child, true);
                }
            }
            
            row.data('processing', false);
        },
    
        collapseNode: function(row) {
            this._trigger('beforeCollapse', null, {'node': row, 'data': row.data('puidata')});
    
            this._hideNodeChildren(row, false);
            
            row.data('processing', false);
            
            this._trigger('afterCollapse', null, {'node': row, 'data': row.data('puidata')});
        },
        
        _hideNodeChildren: function(row, hideOnly) {
            if(!hideOnly) {
                row.data('expanded', false).attr('aria-expanded', false)
                        .find('.pui-treetable-toggler:first').addClass('fa-caret-right').removeClass('fa-caret-down');
            }
            
            var children = this._getChildren(row);
            for(var i = 0; i < children.length; i++) {
                var child = children[i];
                child.addClass('ui-helper-hidden');
                    
                if(child.data('expanded')) {
                    this._hideNodeChildren(child, true);
                }
            }
        },
        
        onRowClick: function(event, row) {
            if($(event.target).is('td,span:not(.ui-c)')) {
                var selected = row.hasClass('ui-state-highlight'),
                metaKey = event.metaKey||event.ctrlKey;

                if(selected && metaKey) {
                    this.unselectNode(row);
                }
                else {
                    if(this.isSingleSelection()||(this.isMultipleSelection() && !metaKey)) {
                        this.unselectAllNodes();
                    }

                    this.selectNode(row);
                }

                PUI.clearSelection();
            }
        },

        selectNode: function(row, silent) {
            row.removeClass('ui-state-hover').addClass('ui-state-highlight').attr('aria-selected', true);

            if(!silent) {
                this._trigger('nodeSelect', {}, {'node': row, 'data': row.data('puidata')});
            }
        },

        unselectNode: function(row, silent) {
            row.removeClass('ui-state-highlight').attr('aria-selected', false);

            if(!silent) {
                this._trigger('nodeUnselect', {}, {'node': row, 'data': row.data('puidata')});
            }
        },

        unselectAllNodes: function() {
            var selectedNodes = this.tbody.children('tr.ui-state-highlight'); 
            for(var i = 0; i < selectedNodes.length; i++) {
                this.unselectNode(selectedNodes.eq(i), true);
            }
        },
        
        isSingleSelection: function() {
            return this.options.selectionMode === 'single';
        },

        isMultipleSelection: function() {
            return this.options.selectionMode === 'multiple';
        },
        
        _getChildren: function(node) {
            var nodeKey = node.data('rowkey'),
            nextNodes = node.nextAll(),
            children = [];

            for(var i = 0; i < nextNodes.length; i++) {
                var nextNode = nextNodes.eq(i),
                nextNodeParentKey = nextNode.data('parentrowkey');

                if(nextNodeParentKey === nodeKey) {
                    children.push(nextNode);
                }
            }

            return children;
        }
    });
    
});
            
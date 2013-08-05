/**
 * PrimeUI Tree widget
 */
$(function() {

    $.widget("primeui.puitree", {
       
        options: {
             nodes: null,
             lazy: false,
             animate: false,
             selectionMode: null,
             icons: null
        },
        
        _create: function() {
            this.element.uniqueId().addClass('pui-tree ui-widget ui-widget-content ui-corner-all')
                    .append('<ul class="pui-tree-container"></ul>');
            this.rootContainer = this.element.children('.pui-tree-container');
            
            if(this.options.selectionMode) {
                this.selection = [];
            }
            
            this._bindEvents();
               
            if($.type(this.options.nodes) === 'array') {
                this._renderNodes(this.options.nodes, this.rootContainer);
            }
            else if($.type(this.options.nodes) === 'function') {
                this.options.nodes.call(this, {}, this._initData);
            }
            else {
                throw 'Unsupported type. nodes option can be either an array or a function';
            }
        },
                
        _renderNodes: function(nodes, container) {
            for(var i = 0; i < nodes.length; i++) {
                this._renderNode(nodes[i], container);
            }
        },
                
        _renderNode: function(node, container) {
            var leaf = this.options.lazy ? node.leaf : !(node.children && node.children.length),
            iconType = node.iconType||'def',
            expanded = node.expanded,
            selectable = this.options.selectionMode ? (node.selectable === false ? false : true) : false,
            toggleIcon = leaf ? 'pui-treenode-leaf-icon' : 
                        (node.expanded ? 'pui-tree-toggler ui-icon ui-icon-triangle-1-s' : 'pui-tree-toggler ui-icon ui-icon-triangle-1-e'),
            styleClass = leaf ? 'pui-treenode pui-treenode-leaf' : 'pui-treenode pui-treenode-parent',
            nodeElement = $('<li class="' + styleClass + '"></li>'),
            contentElement = $('<span class="pui-treenode-content"></span>');
    
            nodeElement.data('puidata', node.data).appendTo(container);

            if(selectable) {
                contentElement.addClass('pui-treenode-selectable');
            }
       
            contentElement.append('<span class="' + toggleIcon + '"></span>')
                            .append('<span class="pui-treenode-icon"></span>')
                            .append('<span class="pui-treenode-label ui-corner-all">' + node.label + '</span>')
                            .appendTo(nodeElement);
                    
            var iconConfig = this.options.icons && this.options.icons[iconType];
            if(iconConfig) {
                var iconContainer = contentElement.children('.pui-treenode-icon'),
                icon = ($.type(iconConfig) === 'string') ? iconConfig : (expanded ? iconConfig.expanded : iconConfig.collapsed);
                iconContainer.addClass('ui-icon ' + icon);
            }
                    
            if(!leaf) {
                var childrenContainer = $('<ul class="pui-treenode-children"></ul>');
                if(!node.expanded) {
                    childrenContainer.hide();
                }
                
                childrenContainer.appendTo(nodeElement);
                
                if(node.children) {
                    for(var i = 0; i < node.children.length; i++) {
                        this._renderNode(node.children[i], childrenContainer);
                    }
                }
            }
        },
                
        _initData: function(data) {
            this._renderNodes(data, this.rootContainer);          
        },
                
        _handleNodeData: function(data, node) {
            this._renderNodes(data, node.children('.pui-treenode-children'));    
            this._showNodeChildren(node);
            node.data('puiloaded', true);
        },
      
        _bindEvents: function() {
            var $this = this,
            elementId = this.element.attr('id'),
            togglerSelector = '#' + elementId + ' .pui-tree-toggler';
    
            $(document).off('click.puitree-' + elementId, togglerSelector)
                .on('click.puitree-' + elementId, togglerSelector, null, function(e) {
                    var toggleIcon = $(this),
                    node = toggleIcon.closest('li');

                    if(node.hasClass('pui-treenode-expanded'))
                        $this.collapseNode(node);
                    else
                        $this.expandNode(node);
                });
                
            if(this.options.selectionMode) {
                var nodeLabelSelector = '#' + elementId + ' .pui-treenode-selectable .pui-treenode-label',
                nodeContentSelector = '#' + elementId + ' .pui-treenode-selectable.pui-treenode-content';

                $(document).off('mouseout.puitree-' + elementId + ' mouseover.puitree-' + elementId, nodeLabelSelector)
                        .on('mouseout.puitree-' + elementId, nodeLabelSelector, null, function() {
                            $(this).removeClass('ui-state-hover');
                        })
                        .on('mouseover.puitree-' + elementId, nodeLabelSelector, null, function() {
                            $(this).addClass('ui-state-hover');
                        })
                        .off('click.puitree-' + elementId, nodeContentSelector)
                        .on('click.puitree-' + elementId, nodeContentSelector, null, function(e) {
                            $this._nodeClick(e, $(this));
                        });
            }
        },
        
        expandNode: function(node) {
            this._trigger('beforeExpand', null, {'node': node, 'data': node.data('puidata')});
    
            if(this.options.lazy && !node.data('puiloaded')) {
                this.options.nodes.call(this, {
                    'node': node,
                    'data': node.data('puidata')
                }, this._handleNodeData);
            }
            else {
                this._showNodeChildren(node);
            }
            
        },
                
        collapseNode: function(node) {
            this._trigger('beforeCollapse', null, {'node': node, 'data': node.data('puidata')});
    
            node.removeClass('pui-treenode-expanded');
            
            var iconType = node.iconType||'def',
            iconConfig = this.options.icons && this.options.icons[iconType];
            if(iconConfig && $.type(iconConfig) !== 'string') {
                node.find('> .pui-treenode-content > .pui-treenode-icon').removeClass(iconConfig.expanded).addClass(iconConfig.collapsed);
            }
            
            var toggleIcon = node.find('> .pui-treenode-content > .pui-tree-toggler'),
            childrenContainer = node.children('.pui-treenode-children');

            toggleIcon.addClass('ui-icon-triangle-1-e').removeClass('ui-icon-triangle-1-s');

            if(this.options.animate)
                childrenContainer.slideUp('fast');
            else
                childrenContainer.hide();
            
            this._trigger('afterCollapse', null, {'node': node, 'data': node.data('puidata')});
        },
                
        _showNodeChildren: function(node) {
            node.addClass('pui-treenode-expanded').attr('aria-expanded', true);
            
            var iconType = node.iconType||'def',
            iconConfig = this.options.icons && this.options.icons[iconType];
            if(iconConfig && $.type(iconConfig) !== 'string') {
                node.find('> .pui-treenode-content > .pui-treenode-icon').removeClass(iconConfig.collapsed).addClass(iconConfig.expanded);
            }

            var toggleIcon = node.find('> .pui-treenode-content > .pui-tree-toggler');
            toggleIcon.addClass('ui-icon-triangle-1-s').removeClass('ui-icon-triangle-1-e');

            if(this.options.animate)
                node.children('.pui-treenode-children').slideDown('fast');
            else
                node.children('.pui-treenode-children').show();
            
            this._trigger('afterExpand', null, {'node': node, 'data': node.data('puidata')});
        },
                
        _nodeClick: function(event, nodeContent) {
            PUI.clearSelection();
        
            if($(event.target).is(':not(.pui-tree-toggler)')) {
                var node = nodeContent.parent();

                var selected = this._isNodeSelected(node.data('puidata')),
                metaKey = event.metaKey||event.ctrlKey;

                if(selected && metaKey) {
                    this.unselectNode(node);
                }
                else {
                    if(this._isSingleSelection()||(this._isMultipleSelection() && !metaKey)) {
                        this.unselectAllNodes();
                    }

                    this.selectNode(node);
                }
            }
        },
                
        selectNode: function(node) {
            node.attr('aria-selected', true).find('> .pui-treenode-content > .pui-treenode-label').removeClass('ui-state-hover').addClass('ui-state-highlight');
            this._addToSelection(node.data('puidata'));
            this._trigger('nodeSelect', null, {'node': node, 'data': node.data('puidata')});
        },
                
        unselectNode: function(node) {           
            node.attr('aria-selected', false).find('> .pui-treenode-content > .pui-treenode-label').removeClass('ui-state-highlight ui-state-hover');
            this._removeFromSelection(node.data('puidata'));
            this._trigger('nodeUnselect', null, {'node': node, 'data': node.data('puidata')});
        },
                
        unselectAllNodes: function() {
            this.selection = [];
            this.element.find('.pui-treenode-label.ui-state-highlight').each(function() {
                $(this).removeClass('ui-state-highlight').closest('.ui-treenode').attr('aria-selected', false);
            });
        },
                
        _addToSelection: function(nodedata) {
            if(nodedata) {
                var selected = this._isNodeSelected(nodedata);                
                if(!selected) {
                    this.selection.push(nodedata);
                }
            }            
        },

        _removeFromSelection: function(nodedata) {
            if(nodedata) {
                var index = -1;
    
                for(var i = 0; i < this.selection.length; i++) {
                    var data = this.selection[i];
                    if(data && (JSON.stringify(data) === JSON.stringify(nodedata))) {
                        index = i;
                        break;
                    }
                }
                
                if(index >= 0) {
                    this.selection.splice(index, 1);
                }
            }            
        },
                
        _isNodeSelected: function(nodedata) {
            var selected = false;

            if(nodedata) {
                for(var i = 0; i < this.selection.length; i++) {
                    var data = this.selection[i];
                    if(data && (JSON.stringify(data) === JSON.stringify(nodedata))) {
                        selected = true;
                        break;
                    }
                }
            }
            
            return selected;
        },
                
        _isSingleSelection: function() {
            return this.options.selectionMode && this.options.selectionMode === 'single';
        },
                
        _isMultipleSelection: function() {
            return this.options.selectionMode && this.options.selectionMode === 'multiple';
        }
    });
    
});
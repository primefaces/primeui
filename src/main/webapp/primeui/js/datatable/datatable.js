/**
 * PrimeUI Datatable Widget
 */
$(function() {

    $.widget("primeui.puidatatable", {
       
        options: {
            columns: null,
            datasource: null,
            paginator: null,
            selectionMode: null,
            rowSelect: null,
            rowUnselect: null,
            caption: null
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            this.element.addClass('pui-datatable ui-widget');
            this.tableWrapper = $('<div class="pui-datatable-tablewrapper" />').appendTo(this.element);
            this.table = $('<table><thead></thead><tbody></tbody></table>').appendTo(this.tableWrapper);
            this.thead = this.table.children('thead');
            this.tbody = this.table.children('tbody').addClass('pui-datatable-data');
            
            if(this.options.datasource) {
                if($.isArray(this.options.datasource)) {
                    this.data = this.options.datasource;
                    this._initialize();
                }
                else if($.type(this.options.datasource) === 'function') {
                    this.options.datasource.call(this, this._handleDataLoad);
                }
            }
        },
                
        _initialize: function() {
            var $this = this;
            
            if(this.options.columns) {
                $.each(this.options.columns, function(i, col) {
                    var header = $('<th class="ui-state-default"></th>').data('field', col.field).appendTo($this.thead);
                                        
                    if(col.headerText) {
                        header.text(col.headerText);
                    }
                    
                    if(col.sortable) {
                        header.addClass('pui-sortable-column')
                                .data('order', 1)
                                .append('<span class="pui-sortable-column-icon ui-icon ui-icon-carat-2-n-s"></span>');
                    }
                });
            }
            
            if(this.options.caption) {
                this.table.prepend('<caption class="pui-datatable-caption ui-widget-header">' + this.options.caption + '</caption>');
            }

            if(this.options.paginator) {
                this.options.paginator.paginate = function(state) {
                    $this.paginate();
                }
                
                this.options.paginator.totalRecords = this.options.paginator.totalRecords||this.data.length;
                this.paginator = $('<div></div>').insertAfter(this.tableWrapper).puipaginator(this.options.paginator);
            }

            if(this._isSortingEnabled()) {
                this._initSorting();
            }
            
            if(this.options.selectionMode) {
                this._initSelection();
            }
            
            this._renderData();
        },
                
        _handleDataLoad: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
                
            this._initialize();
        },
                
        _initSorting: function() {
            var $this = this,
            sortableColumns = this.thead.children('th.pui-sortable-column');
            
            sortableColumns.on('mouseover.puidatatable', function() {
                var column = $(this);

                if(!column.hasClass('ui-state-active'))
                    column.addClass('ui-state-hover');
            })
            .on('mouseout.puidatatable', function() {
                var column = $(this);

                if(!column.hasClass('ui-state-active'))
                    column.removeClass('ui-state-hover');
            })
            .on('click.puidatatable', function() {
                var column = $(this),
                field = column.data('field'),
                order = column.data('order'),
                sortIcon = column.children('.pui-sortable-column-icon');
                
                //clean previous sort state
                column.siblings().filter('.ui-state-active').data('order', 1).removeClass('ui-state-active').children('span.pui-sortable-column-icon')
                                                            .removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s');
                
                $this.sort(field, order);
                
                //update state
                column.data('order', -1*order);
                
                column.removeClass('ui-state-hover').addClass('ui-state-active');
                if(order === -1)
                    sortIcon.removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');
                else if(order === 1)
                    sortIcon.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');
            });
        },
                
        paginate: function() {
            this._renderData();
        },
                
        sort: function(field,order) {
            this.data.sort(function(data1, data2) {
                var value1 = data1[field],
                value2 = data2[field],
                result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

                return (order * result);
            });
            
            if(this.options.selectionMode) {
                this.selection = [];
            }

            if(this.paginator) {
                this.paginator.puipaginator('option', 'page', 0);
            }
            
            this._renderData();
        },
                
        sortByField: function(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase(); 
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        },
                
        _renderData: function() {
            if(this.data) {
                this.tbody.html('');
                
                var first = this.getFirst(),
                rows = this.getRows();

                for(var i = first; i < (first + rows); i++) {
                    var rowData = this.data[i];
                    
                    if(rowData) {
                        var row = $('<tr class="ui-widget-content" />').appendTo(this.tbody),
                        zebraStyle = (i%2 === 0) ? 'pui-datatable-even' : 'pui-datatable-odd';

                        row.addClass(zebraStyle);
                        
                        if(this.options.selectionMode && PUI.inArray(this.selection, i)) {
                            row.addClass("ui-state-highlight");
                        }

                        for(var j = 0; j < this.options.columns.length; j++) {
                            var column = $('<td />').appendTo(row),
                            fieldValue = rowData[this.options.columns[j].field];

                            column.text(fieldValue);
                        }
                    }
                }
            }
        },
                
        getFirst: function() {
            if(this.paginator) {
                var page = this.paginator.puipaginator('option', 'page'),
                rows = this.paginator.puipaginator('option', 'rows');
                
                return (page * rows);
            }
            else {
                return 0;
            }
        },
        
        getRows: function() {
            return this.paginator ? this.paginator.puipaginator('option', 'rows') : this.data.length;
        },
                
        _isSortingEnabled: function() {
            var cols = this.options.columns;
            if(cols) {
                for(var i = 0; i < cols.length; i++) {
                    if(cols[i].sortable) {
                        return true;
                    }
                }
            }
            
            return false;
        },
                
        _initSelection: function() {
            var $this = this;
            this.selection = [];
            this.rowSelector = '#' + this.id + ' tbody.pui-datatable-data > tr.ui-widget-content:not(.ui-datatable-empty-message)';
            
            //shift key based range selection
            if(this._isMultipleSelection()) {
                this.originRowIndex = 0;
                this.cursorIndex = null;
            }
            
            $(document).off('mouseover.puidatatable mouseout.puidatatable click.puidatatable', this.rowSelector)
                    .on('mouseover.datatable', this.rowSelector, null, function() {
                        var element = $(this);

                        if(!element.hasClass('ui-state-highlight')) {
                            element.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.datatable', this.rowSelector, null, function() {
                        var element = $(this);

                        if(!element.hasClass('ui-state-highlight')) {
                            element.removeClass('ui-state-hover');
                        }
                    })
                    .on('click.datatable', this.rowSelector, null, function(e) {
                        $this._onRowClick(e, this);
                    });
        },
                
        _onRowClick: function(event, rowElement) {
            if(!$(event.target).is(':input,:button,a')) {
                var row = $(rowElement),
                selected = row.hasClass('ui-state-highlight'),
                metaKey = event.metaKey||event.ctrlKey,
                shiftKey = event.shiftKey;

                //unselect a selected row if metakey is on
                if(selected && metaKey) {
                    this.unselectRow(row);
                }
                else {
                    //unselect previous selection if this is single selection or multiple one with no keys
                    if(this._isSingleSelection() || (this._isMultipleSelection() && !metaKey && !shiftKey)) {
                        this.unselectAllRows();
                    }
                    
                    this.selectRow(row);
                } 

                PUI.clearSelection();
            }
        },
                
        _isSingleSelection: function() {
            return this.options.selectionMode === 'single';
        },

        _isMultipleSelection: function() {
            return this.options.selectionMode === 'multiple';
        },
                
        unselectAllRows: function() {
            this.tbody.children('tr.ui-state-highlight').removeClass('ui-state-highlight').attr('aria-selected', false);
            this.selection = [];
        },
        
        unselectRow: function(row, silent) {
            var rowIndex = this._getRowIndex(row);
            row.removeClass('ui-state-highlight').attr('aria-selected', false);

            this._removeSelection(rowIndex);

            if(!silent) {
                this._trigger('rowUnselect', null, this.data[rowIndex]);
            }
        },
                
        selectRow: function(row, silent) {
            var rowIndex = this._getRowIndex(row);
            row.removeClass('ui-state-hover').addClass('ui-state-highlight').attr('aria-selected', true);

            this._addSelection(rowIndex);

            if(!silent) {
                this._trigger('rowSelect', null, this.data[rowIndex]);
            }
        },
                
        _removeSelection: function(rowIndex) {        
            this.selection = $.grep(this.selection, function(value) {
                return value !== rowIndex;
            });
        },

        _addSelection: function(rowIndex) {
            if(!this._isSelected(rowIndex)) {
                this.selection.push(rowIndex);
            }
        },
                
        _isSelected: function(rowIndex) {
            return PUI.inArray(this.selection, rowIndex);
        },
                
        _getRowIndex: function(row) {
            var index = row.index();
            
            return this.options.paginator ? this.getFirst() + index : index;
        }
    });
});
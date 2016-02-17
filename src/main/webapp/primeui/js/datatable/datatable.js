/**
 * PrimeUI Datatable Widget
 */
(function() {

    $.widget("primeui.puidatatable", {
       
        options: {
            columns: null,
            datasource: null,
            paginator: null,
            selectionMode: null,
            caption: null,
            footer: null,
            sortField: null,
            sortOrder: null,
            keepSelectionInLazyMode: false,
            scrollable: false,
            scrollHeight: null,
            scrollWidth: null,
            responsive: false,
            expandableRows: false,
            expandedRowContent: null,
            rowExpandMode: 'multiple',
            draggableColumns: false,
            resizableColumns: false,
            columnResizeMode: 'fit',
            draggableRows: false,
            filterDelay: 300,
            stickyHeader: false,
            editMode: null,
            tabindex: 0,
            emptyMessage: 'No records found',
            sort: null,
            rowSelect: null,
            rowUnselect: null,
            rowSelectContextMenu: null,
            rowCollapse: null,
            rowExpand: null,
            colReorder: null,
            colResize: null,
            rowReorder: null,
            cellEdit: null,
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            this.element.addClass('ui-datatable ui-widget');
            if(this.options.responsive) {
                this.element.addClass('ui-datatable-reflow');
            }
            
            if(this.options.scrollable) {
                this._createScrollableDatatable();
            }
            else {
                this._createRegularDatatable();
            }

            if(this.options.datasource) {
                if($.isArray(this.options.datasource)) {
                    this._onDataInit(this.options.datasource);
                }
                else {
                    if($.type(this.options.datasource) === 'string') {
                        var $this = this,
                        dataURL = this.options.datasource;
                
                        this.options.datasource = function() {
                            $.ajax({
                                type: 'GET',
                                url: dataURL,
                                dataType: "json",
                                context: $this,
                                success: function (response) {
                                    this._onDataInit(response);
                                }
                            });
                        };
                    }
                    
                    if($.type(this.options.datasource) === 'function') {
                        if(this.options.lazy)
                            this.options.datasource.call(this, this._onDataInit, {first:0, rows:this._getRows(), sortField:this.options.sortField, sortOrder:this.options.sortOrder, filters: this._createFilterMap()});
                        else
                            this.options.datasource.call(this, this._onDataInit);
                    }
                }
            }
        },
        
        _createRegularDatatable: function() {
            this.tableWrapper = $('<div class="ui-datatable-tablewrapper" />').appendTo(this.element);
            this.table = $('<table><thead></thead><tbody></tbody></table>').appendTo(this.tableWrapper);
            this.thead = this.table.children('thead');
            this.tbody = this.table.children('tbody').addClass('ui-datatable-data');

            if(this.containsFooter()) {
                this.tfoot = this.thead.after('<tfoot></tfoot>').next();
            }
        },
        
        _createScrollableDatatable: function() {            
            this.element.append('<div class="ui-widget-header ui-datatable-scrollable-header"><div class="ui-datatable-scrollable-header-box"><table><thead></thead></table></div></div>')
                        .append('<div class="ui-datatable-scrollable-body"><table><tbody></tbody></table></div>');
        
            this.thead = this.element.find('> .ui-datatable-scrollable-header > .ui-datatable-scrollable-header-box > table > thead');
            this.tbody = this.element.find('> .ui-datatable-scrollable-body > table > tbody');
            
            if(this.containsFooter()) {
                this.element.append('<div class="ui-widget-header ui-datatable-scrollable-footer"><div class="ui-datatable-scrollable-footer-box"><table><tfoot></tfoot></table></div></div>');
                this.tfoot = this.element.find('> .ui-datatable-scrollable-footer > .ui-datatable-scrollable-footer-box > table > tfoot');
            }
        },
                
        _initialize: function() {
            var $this = this;

            this._initHeader();
            this._initFooter();

            if(this.options.caption) {
                this.element.prepend('<div class="ui-datatable-header ui-widget-header">' + this.options.caption + '</div>');
            }
            
            if(this.options.paginator) {
                this.options.paginator.paginate = function(event, state) {
                    $this.paginate();
                };
                
                this.options.paginator.totalRecords = this.options.lazy ? this.options.paginator.totalRecords : this.data.length;
                this.paginator = $('<div></div>').insertAfter(this.tableWrapper).puipaginator(this.options.paginator);
            }
            
            if(this.options.footer) {
                this.element.append('<div class="ui-datatable-footer ui-widget-header">' + this.options.footer + '</div>');
            }

            if(this._isSortingEnabled()) {
                this._initSorting();
            }
            
            if(this.hasFiltering) {
                this._initFiltering();
            }
            
            if(this.options.selectionMode) {
                this._initSelection();
            }
            
            if(this.options.expandableRows) {
                this._initExpandableRows();
            }
            
            if(this.options.draggableColumns) {
                this._initDraggableColumns();
            }
            
            if(this.options.stickyHeader) {
                this._initStickyHeader();
            }

            if (this.options.sortField && this.options.sortOrder) {
                this._indicateInitialSortColumn();
                this.sort(this.options.sortField, this.options.sortOrder);
            } 
            else {
                this._renderData();
            }
            
            if(this.options.scrollable) {
                this._initScrolling();
            }
            
            if(this.options.resizableColumns) {
                this._initResizableColumns();
            }
            
            if(this.options.draggableRows) {
                this._initDraggableRows();
            }
            
            if(this.options.editMode) {
                this._initEditing();
            }

        },
        
        _initHeader: function() {
            if(this.options.headerRows) {
                for(var i = 0; i < this.options.headerRows.length; i++) {
                    this._initHeaderColumns(this.options.headerRows[i].columns);
                }
            }            
            else if(this.options.columns) {
                this._initHeaderColumns(this.options.columns);
            }
        },
        
        _initFooter: function() {
            if(this.containsFooter()) {
                if(this.options.footerRows) {
                    for(var i = 0; i < this.options.footerRows.length; i++) {
                        this._initFooterColumns(this.options.footerRows[i].columns);
                    }
                }            
                else if(this.options.columns) {
                    this._initFooterColumns(this.options.columns);
                }
            }
        },
        
        _initHeaderColumns: function(columns) {
            var headerRow = $('<tr></tr>').appendTo(this.thead),
            $this = this;
    
            $.each(columns, function(i, col) {
                var cell = $('<th class="ui-state-default"><span class="ui-column-title"></span></th>').data('field', col.field).uniqueId().appendTo(headerRow);

                if(col.headerClass) {
                    cell.addClass(col.headerClass);
                }

                if(col.headerStyle) {
                    cell.attr('style', col.headerStyle);
                }

                if(col.headerText)
                    cell.children('.ui-column-title').text(col.headerText);
                else if(col.headerContent)
                    cell.children('.ui-column-title').append(col.headerContent.call(this, col));
                
                if(col.rowspan) {
                    cell.attr('rowspan', col.rowspan);
                }
                
                if(col.colspan) {
                    cell.attr('colspan', col.colspan);
                }

                if(col.sortable) {
                    cell.addClass('ui-sortable-column')
                            .data('order', 0)
                            .append('<span class="ui-sortable-column-icon fa fa-fw fa-sort"></span>');
                }
                
                if(col.filter) {
                    $this.hasFiltering = true;
                    
                    var filterElement = $('<input type="text" class="ui-column-filter" />').puiinputtext().data({
                        'field': col.field,
                        'filtermatchmode': col.filterMatchMode||'startsWith'
                    }).appendTo(cell);
                    
                    if(col.filterFunction) {
                        filterElement.on('filter', function(event, dataValue, filterValue) {
                            return col.filterFunction.call($this, dataValue, filterValue);
                        });
                    }
                }
            });
        },
        
        _initFooterColumns: function(columns) {
            var footerRow = $('<tr></tr>').appendTo(this.tfoot);
            $.each(columns, function(i, col) {
                var cell = $('<td class="ui-state-default"></td>');
                if(col.footerText) {
                    cell.text(col.footerText);
                }
                
                if(col.rowspan) {
                    cell.attr('rowspan', col.rowspan);
                }
                
                if(col.colspan) {
                    cell.attr('colspan', col.colspan);
                }

                cell.appendTo(footerRow);
            });
        },

        _indicateInitialSortColumn: function() {
            this.sortableColumns = this.thead.find('> tr > th.ui-sortable-column');
            var $this = this;
            
            $.each(this.sortableColumns, function(i, column) {
                var $column = $(column),
                    data = $column.data();
                if ($this.options.sortField === data.field) {
                    var sortIcon = $column.children('.ui-sortable-column-icon');
                    $column.data('order', $this.options.sortOrder).removeClass('ui-state-hover').addClass('ui-state-active');
                    if($this.options.sortOrder === -1)
                        sortIcon.removeClass('fa-sort fa-sort-asc').addClass('fa-sort-desc');
                    else if($this.options.sortOrder === 1)
                        sortIcon.removeClass('fa-sort fa-sort-desc').addClass('fa-sort-asc');
                }
            });

        },

        _onDataInit: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
                
            this._initialize();
        },
                
        _onDataUpdate: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
            
            this.reset();
                
            this._renderData();
        },
        
        _onLazyLoad: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
            
            this._renderData();
        },
        
        reset: function() {
            if(this.options.selectionMode) {
                this.selection = [];
            }
            
            if(this.paginator) {
                this.paginator.puipaginator('setState', {
                    page: 0,
                    totalRecords: this.options.lazy ? this.options.paginator.totalRecords : this.data.length
                });
            }

            this.thead.find('> tr > th.ui-sortable-column').data('order', 0).filter('.ui-state-active').removeClass('ui-state-active')
                                .children('span.ui-sortable-column-icon').removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
        },
                
        _initSorting: function() {
            var $this = this,
            sortableColumns = this.thead.find('> tr > th.ui-sortable-column');
            
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
            .on('click.puidatatable', function(event) {
                if(!$(event.target).is('th,span')) {
                    return;
                }
                
                var column = $(this),
                sortField = column.data('field'),
                order = column.data('order'),
                sortOrder = (order === 0) ? 1 : (order * -1),
                sortIcon = column.children('.ui-sortable-column-icon');
                
                //clean previous sort state
                column.siblings().filter('.ui-state-active').data('order', 0).removeClass('ui-state-active').children('span.ui-sortable-column-icon')
                                                            .removeClass('fa-sort-asc fa-sort-desc').addClass('fa-sort');
                                                    
                //update state
                $this.options.sortField = sortField;
                $this.options.sortOrder = sortOrder;
    
                $this.sort(sortField, sortOrder);
                                
                column.data('order', sortOrder).removeClass('ui-state-hover').addClass('ui-state-active');
                if(sortOrder === -1)
                    sortIcon.removeClass('fa-sort fa-sort-asc').addClass('fa-sort-desc');
                else if(sortOrder === 1)
                    sortIcon.removeClass('fa-sort fa-sort-desc').addClass('fa-sort-asc');
                
                $this._trigger('sort', event, {'sortOrder' : sortOrder, 'sortField' : sortField});
            });
        },
        
        paginate: function() {
            if(this.options.lazy) {
                if(this.options.selectionMode && ! this.options.keepSelectionInLazyMode) {
                    this.selection = [];
                }
                this.options.datasource.call(this, this._onLazyLoad, this._createStateMeta());
            }
            else {
               this._renderData();
            }
        },
                
        sort: function(field, order) {
            if(this.options.selectionMode) {
                this.selection = [];
            }
            
            if(this.options.lazy) {
                this.options.datasource.call(this, this._onLazyLoad, this._createStateMeta());
            }
            else {
                this.data.sort(function(data1, data2) {
                    var value1 = data1[field], value2 = data2[field],
                    result = null;
                    
                    if (typeof value1 == 'string' || value1 instanceof String) {
                    	if ( value1.localeCompare ) {
                    		return (order * value1.localeCompare(value2));
                    	}
                    	else {
                        	if (value1.toLowerCase) {
                            	value1 = value1.toLowerCase();
                            }
                            if (value2.toLowerCase) {
                            	value2 = value2.toLowerCase();
                            }
                            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                            
                            
                    	}
                    }
                    else {
                        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                    }  
                    
                    return (order * result);
                });

                if(this.options.selectionMode) {
                    this.selection = [];
                }

                if(this.paginator) {
                    this.paginator.puipaginator('option', 'page', 0);
                }

                this._renderData();
            }
        },
                
        sortByField: function(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase(); 
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        },
                
        _renderData: function() {
            this.tbody.html('');
            
            var dataToRender = this.filteredData||this.data;
            if(dataToRender && dataToRender.length) {
                var firstNonLazy = this._getFirst(),
                first = this.options.lazy ? 0 : firstNonLazy,
                rows = this._getRows();

                for(var i = first; i < (first + rows); i++) {
                    var rowData = dataToRender[i];
                    
                    if(rowData) {
                        var row = $('<tr class="ui-widget-content" />').appendTo(this.tbody),
                        zebraStyle = (i%2 === 0) ? 'ui-datatable-even' : 'ui-datatable-odd',
                        rowIndex = i;

                        row.addClass(zebraStyle);
                        
                        if(this.options.lazy) {
                            rowIndex += firstNonLazy; // Selection is kept as it is non lazy data
                        }

                        if(this.options.selectionMode && PUI.inArray(this.selection, rowIndex)) {
                            row.addClass("ui-state-highlight");
                        }
                        
                        row.data('rowindex', rowIndex);

                        for(var j = 0; j < this.options.columns.length; j++) {
                            var column = $('<td />').appendTo(row),
                            columnOptions = this.options.columns[j];

                            if(columnOptions.bodyClass) {
                                column.addClass(columnOptions.bodyClass);
                            } 

                            if(columnOptions.bodyStyle) {
                                column.attr('style', columnOptions.bodyStyle);
                            }
                            
                            if(columnOptions.editor) {
                                column.addClass('ui-editable-column').data({
                                    'editor': columnOptions.editor, 
                                    'rowdata': rowData,
                                    'field': columnOptions.field
                                });
                            }
                            
                            if(columnOptions.content) {
                                var content = columnOptions.content.call(this, rowData, columnOptions);
                                if($.type(content) === 'string')
                                    column.html(content);
                                else
                                    column.append(content);
                            }
                            else if(columnOptions.rowToggler) {
                                column.append('<div class="ui-row-toggler fa fa-fw fa-chevron-circle-right ui-c"></div>');
                            }
                            else if(columnOptions.field) {
                                column.text(rowData[columnOptions.field]);
                            }
                            
                            if(this.options.responsive && columnOptions.headerText) {
                                column.prepend('<span class="ui-column-title">' + columnOptions.headerText + '</span>');
                            }
                        }
                    }
                }
            }
            else {
                var emptyRow = $('<tr class="ui-widget-content"></tr>').appendTo(this.tbody);
                var emptyColumn = $('<td></td>').attr('colspan',this.options.columns.length).appendTo(emptyRow);
                emptyColumn.html(this.options.emptyMessage);
            }
        },
                                
        _getFirst: function() {
            if(this.paginator) {
                var page = this.paginator.puipaginator('option', 'page'),
                rows = this.paginator.puipaginator('option', 'rows');
                
                return (page * rows);
            }
            else {
                return 0;
            }
        },
        
        _getRows: function() {
            return this.paginator ? this.paginator.puipaginator('option', 'rows') : (this.data ? this.data.length : 0);
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
            this.rowSelector = '> tr.ui-widget-content:not(.ui-datatable-empty-message,.ui-datatable-unselectable)';
            
            //shift key based range selection
            if(this._isMultipleSelection()) {
                this.originRowIndex = 0;
                this.cursorIndex = null;
            }
                        
            this.tbody.off('mouseover.puidatatable mouseout.puidatatable mousedown.puidatatable click.puidatatable', this.rowSelector)
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
                    .on('mousedown.datatable', this.rowSelector, null, function() {
                        $this.mousedownOnRow = true;
                    })
                    .on('click.datatable', this.rowSelector, null, function(e) {
                        $this._onRowClick(e, this);
                        $this.mousedownOnRow = false;
                    });
                    
            this._bindSelectionKeyEvents();
        },
                
        _onRowClick: function(event, rowElement) {
            if(!$(event.target).is(':input,:button,a,.ui-c')) {
                var row = $(rowElement),
                selected = row.hasClass('ui-state-highlight'),
                metaKey = event.metaKey||event.ctrlKey,
                shiftKey = event.shiftKey;
        
                this.focusedRow = row;

                //unselect a selected row if metakey is on
                if(selected && metaKey) {
                    this.unselectRow(row);
                }
                else {
                    //unselect previous selection if this is single selection or multiple one with no keys
                    if(this._isSingleSelection() || (this._isMultipleSelection() && !metaKey && !shiftKey)) {
                        if (this._isMultipleSelection()) {
                            var selections = this.getSelection();
                            for (var i = 0; i < selections.length; i++) {
                                this._trigger('rowUnselect', null, selections[i]);
                            }
                        }

                        this.unselectAllRows();
                    }
                    
                    this.selectRow(row, false, event);
                } 

                PUI.clearSelection();
            }
        },
        
        onRowRightClick: function(event, rowElement) {
            var row = $(rowElement),
            rowIndex = this._getRowIndex(row),
            selectedData = this.data[rowIndex],
            selected = row.hasClass('ui-state-highlight');
    
            if(this._isSingleSelection() || !selected) {
                this.unselectAllRows();
            }
            
            this.selectRow(row, true);
            this.dataSelectedByContextMenu = selectedData;
            this._trigger('rowSelectContextMenu', event, selectedData);

            PUI.clearSelection();
        },
        
        _bindSelectionKeyEvents: function() {
            var $this = this;

            this.tbody.attr('tabindex', this.options.tabindex).on('focus', function(e) {
                //ignore mouse click on row
                if(!$this.mousedownOnRow) {
                    $this.focusedRow = $this.tbody.children('tr.ui-widget-content').eq(0);
                    $this.focusedRow.addClass('ui-state-hover');
                }
            })
            .on('blur', function() {
                if($this.focusedRow) {
                    $this.focusedRow.removeClass('ui-state-hover');
                    $this.focusedRow = null;
                }
            })
            .on('keydown', function(e) {
                var keyCode = $.ui.keyCode,
                key = e.which;

                if($this.focusedRow) {
                    switch(key) {
                        case keyCode.UP:
                            var prevRow = $this.focusedRow.prev('tr.ui-widget-content');
                            if(prevRow.length) {
                                $this.focusedRow.removeClass('ui-state-hover');
                                $this.focusedRow = prevRow;
                                $this.focusedRow.addClass('ui-state-hover');
                            }
                            e.preventDefault();
                        break;

                        case keyCode.DOWN:
                            var nextRow = $this.focusedRow.next('tr.ui-widget-content');
                            if(nextRow.length) {
                                $this.focusedRow.removeClass('ui-state-hover');
                                $this.focusedRow = nextRow;
                                $this.focusedRow.addClass('ui-state-hover');
                            }
                            e.preventDefault();
                        break;

                        case keyCode.ENTER:
                        case keyCode.NUMPAD_ENTER:
                        case keyCode.SPACE:
                            e.target = $this.focusedRow.children().eq(0).get(0);
                            $this._onRowClick(e, $this.focusedRow.get(0));
                            e.preventDefault();
                        break;

                        default:
                        break;
                    };
                }
            });

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
                
        selectRow: function(row, silent, event) {
            var rowIndex = this._getRowIndex(row),
            selectedData = this.data[rowIndex];
            row.removeClass('ui-state-hover').addClass('ui-state-highlight').attr('aria-selected', true);

            this._addSelection(rowIndex);

            if(!silent) {
                if (this.options.lazy) {
                    selectedData = this.data[rowIndex - this._getFirst()];
                }
                
                this._trigger('rowSelect', event, selectedData);
            }
        },
                
        getSelection: function() {
            var first = this.options.lazy ? this._getFirst() : 0,
                selections = [];
            for(var i = 0; i < this.selection.length; i++) {
                if(this.data.length > this.selection[i]-first && this.selection[i]-first > 0) {
                    selections.push(this.data[this.selection[i]-first]);
                }
            }
            return selections;
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
            return row.data('rowindex');
        },
        
        _initExpandableRows: function() {
            var $this = this,
            togglerSelector = '> tr > td > div.ui-row-toggler';

            this.tbody.off('click', togglerSelector)
                .on('click', togglerSelector, null, function() {
                    $this.toggleExpansion($(this));
                })
                .on('keydown', togglerSelector, null, function(e) {
                    var key = e.which,
                    keyCode = $.ui.keyCode;

                    if((key === keyCode.ENTER||key === keyCode.NUMPAD_ENTER)) {
                        $this.toggleExpansion($(this));
                        e.preventDefault();
                    }
            });
        },
        
        toggleExpansion: function(toggler) {
            var row = toggler.closest('tr'),
            expanded = toggler.hasClass('fa-chevron-circle-down');
    
            if(expanded) {
                toggler.addClass('fa-chevron-circle-right').removeClass('fa-chevron-circle-down').attr('aria-expanded', false);

                this.collapseRow(row);
                this._trigger('rowCollapse', null, this.data[this._getRowIndex(row)]);
            }
            else {
                if(this.options.rowExpandMode === 'single') {
                    this.collapseAllRows();
                }

                toggler.addClass('fa-chevron-circle-down').removeClass('fa-chevron-circle-right').attr('aria-expanded', true);

                this.loadExpandedRowContent(row);
            }
        },
        
        loadExpandedRowContent: function(row) {
            var rowIndex = this._getRowIndex(row),
            expandedRow = $('<tr class="ui-expanded-row-content ui-datatable-unselectable ui-widget-content"><td colspan="' + this.options.columns.length + '"></td></tr>');
            expandedRow.children('td').append(this.options.expandedRowContent.call(this, this.data[rowIndex]));

            row.addClass('ui-expanded-row').after(expandedRow);
            this._trigger('rowExpand', null, this.data[this._getRowIndex(row)]);
        },
        
        collapseRow: function(row) {
            row.removeClass('ui-expanded-row').next('.ui-expanded-row-content').remove();
        },
        
        collapseAllRows: function() {
            var $this = this;

            this.getExpandedRows().each(function () {
                var expandedRow = $(this);
                $this.collapseRow(expandedRow);

                var columns = expandedRow.children('td');
                for (var i = 0; i < columns.length; i++) {
                    var column = columns.eq(i),
                    toggler = column.children('.ui-row-toggler');

                    if (toggler.length) {
                        toggler.addClass('fa-chevron-circle-right').removeClass('fa-chevron-circle-down');
                    }
                }
            });
        },
        
        getExpandedRows: function () {
            return this.tbody.children('.ui-expanded-row');
        },
                
        _createStateMeta: function() {
            var state = {
                first: this._getFirst(),
                rows: this._getRows(),
                sortField: this.options.sortField,
                sortOrder: this.options.sortOrder,
                filters: this.filterMetaMap
            };
            
            return state;
        },
                
        _updateDatasource: function(datasource) {
            this.options.datasource = datasource;
                        
            if($.isArray(this.options.datasource)) {
                this._onDataUpdate(this.options.datasource);
            }
            else if($.type(this.options.datasource) === 'function') {
                if(this.options.lazy)
                    this.options.datasource.call(this, this._onDataUpdate, {first:0, rows: this._getRows(), sortField:this.options.sortField, sortorder:this.options.sortOrder, filters: this._createFilterMap()});
                else
                    this.options.datasource.call(this, this._onDataUpdate);
            }
        },
                
        _setOption: function(key, value) {
            if(key === 'datasource') {
                this._updateDatasource(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
        
        _initScrolling: function() {
            this.scrollHeader = this.element.children('.ui-datatable-scrollable-header');
            this.scrollBody = this.element.children('.ui-datatable-scrollable-body');
            this.scrollHeaderBox = this.scrollHeader.children('.ui-datatable-scrollable-header-box');
            this.headerTable = this.scrollHeaderBox.children('table');
            this.bodyTable = this.scrollBody.children('table');
            this.percentageScrollHeight = this.options.scrollHeight && (this.options.scrollHeight.indexOf('%') !== -1);
            this.percentageScrollWidth = this.options.scrollWidth && (this.options.scrollWidth.indexOf('%') !== -1);
            var $this = this,
            scrollBarWidth = this.getScrollbarWidth() + 'px';

            if(this.options.scrollHeight) {
                if(this.percentageScrollHeight)
                    this.adjustScrollHeight();
                else
                    this.scrollBody.css('max-height', this.options.scrollHeight + 'px');

                if(this.hasVerticalOverflow()) {
                    this.scrollHeaderBox.css('margin-right', scrollBarWidth);
                }
            }

            this.fixColumnWidths();

            if(this.options.scrollWidth) {
                if(this.percentageScrollWidth)
                    this.adjustScrollWidth();
                else
                    this.setScrollWidth(parseInt(this.options.scrollWidth));
            }

            this.cloneHead();

            this.scrollBody.on('scroll.dataTable', function() {
                var scrollLeft = $this.scrollBody.scrollLeft();
                $this.scrollHeaderBox.css('margin-left', -scrollLeft);
            });

            this.scrollHeader.on('scroll.dataTable', function() {
                $this.scrollHeader.scrollLeft(0);
            });

            var resizeNS = 'resize.' + this.id;
            $(window).off(resizeNS).on(resizeNS, function() {
                if($this.element.is(':visible')) {
                    if($this.percentageScrollHeight)
                        $this.adjustScrollHeight();

                    if($this.percentageScrollWidth)
                        $this.adjustScrollWidth();
                }
            });
        },

        cloneHead: function() {
            this.theadClone = this.thead.clone();
            this.theadClone.find('th').each(function() {
                var header = $(this);
                header.attr('id', header.attr('id') + '_clone');
                $(this).children().not('.ui-column-title').remove();
            });
            this.theadClone.removeAttr('id').addClass('ui-datatable-scrollable-theadclone').height(0).prependTo(this.bodyTable);

            //align horizontal scroller on keyboard tab
            if(this.options.scrollWidth) {
                var clonedSortableColumns = this.theadClone.find('> tr > th.ui-sortable-column');
                clonedSortableColumns.each(function() {
                    $(this).data('original', $(this).attr('id').split('_clone')[0]);
                });

                clonedSortableColumns.on('blur.dataTable', function() {
                    $(PUI.escapeClientId($(this).data('original'))).removeClass('ui-state-focus');
                })
                .on('focus.dataTable', function() {
                    $(PUI.escapeClientId($(this).data('original'))).addClass('ui-state-focus');
                })
                .on('keydown.dataTable', function(e) {
                    var key = e.which,
                    keyCode = $.ui.keyCode;

                    if((key === keyCode.ENTER||key === keyCode.NUMPAD_ENTER) && $(e.target).is(':not(:input)')) {
                        $(PUI.escapeClientId($(this).data('original'))).trigger('click.dataTable', (e.metaKey||e.ctrlKey));
                        e.preventDefault();
                    }
                });
            }
        },

        adjustScrollHeight: function() {
            var relativeHeight = this.element.parent().innerHeight() * (parseInt(this.options.scrollHeight) / 100),
            tableHeaderHeight = this.element.children('.ui-datatable-header').outerHeight(true),
            tableFooterHeight = this.element.children('.ui-datatable-footer').outerHeight(true),
            scrollersHeight = (this.scrollHeader.outerHeight(true) + this.scrollFooter.outerHeight(true)),
            paginatorsHeight = this.paginator ? this.paginator.getContainerHeight(true) : 0,
            height = (relativeHeight - (scrollersHeight + paginatorsHeight + tableHeaderHeight + tableFooterHeight));

            this.scrollBody.css('max-height', height + 'px');
        },

        adjustScrollWidth: function() {
            var width = parseInt((this.element.parent().innerWidth() * (parseInt(this.options.scrollWidth) / 100)));
            this.setScrollWidth(width);
        },

        setOuterWidth: function(element, width) {
            var diff = element.outerWidth() - element.width();
            element.width(width - diff);
        },

        setScrollWidth: function(width) {
            var $this = this;
            this.element.children('.ui-widget-header').each(function() {
                $this.setOuterWidth($(this), width);
            });
            this.scrollHeader.width(width);
            this.scrollBody.css('margin-right', 0).width(width);
        },

        alignScrollBody: function() {
            var marginRight = this.hasVerticalOverflow() ? this.getScrollbarWidth() + 'px' : '0px';

            this.scrollHeaderBox.css('margin-right', marginRight);
        },

        getScrollbarWidth: function() {
            if(!this.scrollbarWidth) {
                this.scrollbarWidth = PUI.browser.webkit ? '15' : PUI.calculateScrollbarWidth();
            }

            return this.scrollbarWidth;
        },

        hasVerticalOverflow: function() {
            return (this.options.scrollHeight && this.bodyTable.outerHeight() > this.scrollBody.outerHeight())
        },

        restoreScrollState: function() {
            var scrollState = this.scrollStateHolder.val(),
            scrollValues = scrollState.split(',');

            this.scrollBody.scrollLeft(scrollValues[0]);
            this.scrollBody.scrollTop(scrollValues[1]);
        },

        saveScrollState: function() {
            var scrollState = this.scrollBody.scrollLeft() + ',' + this.scrollBody.scrollTop();

            this.scrollStateHolder.val(scrollState);
        },

        clearScrollState: function() {
            this.scrollStateHolder.val('0,0');
        },

        fixColumnWidths: function() {
            if(!this.columnWidthsFixed) {
                if(this.options.scrollable) {
                    this.scrollHeaderBox.find('> table > thead > tr > th').each(function() {
                        var headerCol = $(this),
                        width = headerCol.width();
                        headerCol.width(width);
                    });
                }
                else {
                    this.element.find('> .ui-datatable-tablewrapper > table > thead > tr > th').each(function() {
                        var col = $(this);
                        col.width(col.width());
                    });
                }

                this.columnWidthsFixed = true;
            }
        },
        
        _initDraggableColumns: function() {
            var $this = this;
            
            this.dragIndicatorTop = $('<span class="fa fa-arrow-down" style="position:absolute"/></span>').hide().appendTo(this.element);
            this.dragIndicatorBottom = $('<span class="fa fa-arrow-up" style="position:absolute"/></span>').hide().appendTo(this.element);

            this.thead.find('> tr > th').draggable({
                appendTo: 'body',
                opacity: 0.75,
                cursor: 'move',
                scope: this.id,
                cancel: ':input,.ui-column-resizer',
                drag: function(event, ui) {
                    var droppable = ui.helper.data('droppable-column');

                    if(droppable) {
                        var droppableOffset = droppable.offset(),
                        topArrowY = droppableOffset.top - 10,
                        bottomArrowY = droppableOffset.top + droppable.height() + 8,
                        arrowX = null;

                        //calculate coordinates of arrow depending on mouse location
                        if(event.originalEvent.pageX >= droppableOffset.left + (droppable.width() / 2)) {
                            var nextDroppable = droppable.next();
                            if(nextDroppable.length == 1)
                                arrowX = nextDroppable.offset().left - 9;
                            else
                                arrowX = droppable.offset().left + droppable.innerWidth() - 9;

                            ui.helper.data('drop-location', 1);     //right
                        }
                        else {
                            arrowX = droppableOffset.left  - 9;
                            ui.helper.data('drop-location', -1);    //left
                        }

                        $this.dragIndicatorTop.offset({
                            'left': arrowX, 
                            'top': topArrowY - 3
                        }).show();

                        $this.dragIndicatorBottom.offset({
                            'left': arrowX, 
                            'top': bottomArrowY - 3
                        }).show();
                    }
                },
                stop: function(event, ui) {
                    //hide dnd arrows
                    $this.dragIndicatorTop.css({
                        'left':0, 
                        'top':0
                    }).hide();

                    $this.dragIndicatorBottom.css({
                        'left':0, 
                        'top':0
                    }).hide();
                },
                helper: function() {
                    var header = $(this),
                    helper = $('<div class="ui-widget ui-state-default" style="padding:4px 10px;text-align:center;"></div>');

                    helper.width(header.width());
                    helper.height(header.height());

                    helper.html(header.html());

                    return helper.get(0);
                }
            }).droppable({
                hoverClass:'ui-state-highlight',
                tolerance:'pointer',
                scope: this.id,
                over: function(event, ui) {
                    ui.helper.data('droppable-column', $(this));
                },
                drop: function(event, ui) {
                    var draggedColumnHeader = ui.draggable,
                    dropLocation = ui.helper.data('drop-location'),
                    droppedColumnHeader =  $(this),
                    draggedColumnFooter = null,
                    droppedColumnFooter = null;

                    var draggedCells = $this.tbody.find('> tr:not(.ui-expanded-row-content) > td:nth-child(' + (draggedColumnHeader.index() + 1) + ')'),
                    droppedCells = $this.tbody.find('> tr:not(.ui-expanded-row-content) > td:nth-child(' + (droppedColumnHeader.index() + 1) + ')');

                    if($this.containsFooter()) {
                        var footerColumns = $this.tfoot.find('> tr > td'),
                        draggedColumnFooter = footerColumns.eq(draggedColumnHeader.index()),
                        droppedColumnFooter = footerColumns.eq(droppedColumnHeader.index());
                    }

                    //drop right
                    if(dropLocation > 0) {
                        /* TODO :Resizable columns
                         * if($this.options.resizableColumns) {
                            if(droppedColumnHeader.next().length) {
                                droppedColumnHeader.children('span.ui-column-resizer').show();
                                draggedColumnHeader.children('span.ui-column-resizer').hide();
                            }
                        }*/

                        draggedColumnHeader.insertAfter(droppedColumnHeader);

                        draggedCells.each(function(i, item) {
                            $(this).insertAfter(droppedCells.eq(i));
                        });

                        if(draggedColumnFooter && droppedColumnFooter) {
                            draggedColumnFooter.insertAfter(droppedColumnFooter);
                        }

                        //sync clone
                        if($this.options.scrollable) {
                            var draggedColumnClone = $(document.getElementById(draggedColumnHeader.attr('id') + '_clone')),
                            droppedColumnClone = $(document.getElementById(droppedColumnHeader.attr('id') + '_clone'));
                            draggedColumnClone.insertAfter(droppedColumnClone);
                        }
                    }
                    //drop left
                    else {
                        draggedColumnHeader.insertBefore(droppedColumnHeader);

                        draggedCells.each(function(i, item) {
                            $(this).insertBefore(droppedCells.eq(i));
                        });

                        if(draggedColumnFooter && droppedColumnFooter) {
                            draggedColumnFooter.insertBefore(droppedColumnFooter);
                        }

                        //sync clone
                        if($this.options.scrollable) {
                            var draggedColumnClone = $(document.getElementById(draggedColumnHeader.attr('id') + '_clone')),
                            droppedColumnClone = $(document.getElementById(droppedColumnHeader.attr('id') + '_clone'));
                            draggedColumnClone.insertBefore(droppedColumnClone);
                        }
                    }

                    //fire colReorder event
                    $this._trigger('colReorder', null, {
                        dragIndex: draggedColumnHeader.index(),
                        dropIndex: droppedColumnHeader.index()
                    });
                }
            });
        },
        
        containsFooter: function() {
            if(this.hasFooter === undefined) {
                this.hasFooter = this.options.footerRows !== undefined;
                if(!this.hasFooter) {
                    if(this.options.columns) {
                        for(var i = 0; i  < this.options.columns.length; i++) {
                            if(this.options.columns[i].footerText !== undefined) {
                                this.hasFooter = true;
                                break;
                            }
                        }
                    }
                }
            }

            return this.hasFooter;
        },
        
        _initResizableColumns: function() {
            this.element.addClass('ui-datatable-resizable');
            this.thead.find('> tr > th').addClass('ui-resizable-column');
            this.resizerHelper = $('<div class="ui-column-resizer-helper ui-state-highlight"></div>').appendTo(this.element);
            this.addResizers();
            var resizers = this.thead.find('> tr > th > span.ui-column-resizer'),
            $this = this;

            setTimeout(function() {
                $this.fixColumnWidths();
            }, 5);

            resizers.draggable({
                axis: 'x',
                start: function(event, ui) {
                    ui.helper.data('originalposition', ui.helper.offset());

                    var height = $this.options.scrollable ? $this.scrollBody.height() : $this.thead.parent().height() - $this.thead.height() - 1;
                    $this.resizerHelper.height(height);
                    $this.resizerHelper.show();
                },
                drag: function(event, ui) {
                    $this.resizerHelper.offset({
                        left: ui.helper.offset().left + ui.helper.width() / 2, 
                        top: $this.thead.offset().top + $this.thead.height()
                    });                
                },
                stop: function(event, ui) {                
                    ui.helper.css({
                        'left': '',
                        'top': '0px',
                        'right': '0px'
                    });

                    $this.resize(event, ui);
                    $this.resizerHelper.hide();

                    if($this.options.columnResizeMode === 'expand') {
                        setTimeout(function() {
                            $this._trigger('colResize', null, {element: ui.helper.parent()});
                        }, 5);
                    }
                    else {
                        $this._trigger('colResize', null, {element: ui.helper.parent()});
                    }

                    if($this.options.stickyHeader) {
                        $this.thead.find('.ui-column-filter').prop('disabled', false);
                        $this.clone = $this.thead.clone(true);
                        $this.cloneContainer.find('thead').remove();
                        $this.cloneContainer.children('table').append($this.clone);
                        $this.thead.find('.ui-column-filter').prop('disabled', true);
                    }
                },
                containment: this.element
            });
        },
        
        resize: function(event, ui) {
            var columnHeader, nextColumnHeader, change = null, newWidth = null, nextColumnWidth = null, 
            expandMode = (this.options.columnResizeMode === 'expand'),
            table = this.thead.parent(),
            columnHeader = ui.helper.parent(),
            nextColumnHeader = columnHeader.next();

            change = (ui.position.left - ui.originalPosition.left),
            newWidth = (columnHeader.width() + change),
            nextColumnWidth = (nextColumnHeader.width() - change);

            if((newWidth > 15 && nextColumnWidth > 15) || (expandMode && newWidth > 15)) {          
                if(expandMode) {
                    table.width(table.width() + change);
                    setTimeout(function() {
                        columnHeader.width(newWidth);
                    }, 1);
                }
                else {
                    columnHeader.width(newWidth);
                    nextColumnHeader.width(nextColumnWidth);
                }

                if(this.options.scrollable) {
                    var cloneTable = this.theadClone.parent(),
                    colIndex = columnHeader.index();

                    if(expandMode) {
                        var $this = this;

                        //body
                        cloneTable.width(cloneTable.width() + change);

                        //footer
                        this.footerTable.width(this.footerTable.width() + change);

                        setTimeout(function() {
                            if($this.hasColumnGroup) {
                                $this.theadClone.find('> tr:first').children('th').eq(colIndex).width(newWidth);            //body
                                $this.footerTable.find('> tfoot > tr:first').children('th').eq(colIndex).width(newWidth);   //footer
                            }
                            else {
                                $this.theadClone.find(PUI.escapeClientId(columnHeader.attr('id') + '_clone')).width(newWidth);   //body
                                $this.footerCols.eq(colIndex).width(newWidth);                                                          //footer
                            }
                        }, 1);
                    }
                    else {
                        //body
                        this.theadClone.find(PUI.escapeClientId(columnHeader.attr('id') + '_clone')).width(newWidth);
                        this.theadClone.find(PUI.escapeClientId(nextColumnHeader.attr('id') + '_clone')).width(nextColumnWidth);

                        //footer
                        /*if(this.footerCols.length > 0) {
                            var footerCol = this.footerCols.eq(colIndex),
                            nextFooterCol = footerCol.next();

                            footerCol.width(newWidth);
                            nextFooterCol.width(nextColumnWidth);
                        }*/
                    }
                }            
            }
        },
        
        addResizers: function() {
            var resizableColumns = this.thead.find('> tr > th.ui-resizable-column');
            resizableColumns.prepend('<span class="ui-column-resizer">&nbsp;</span>');

            if(this.options.columnResizeMode === 'fit') {
                resizableColumns.filter(':last-child').children('span.ui-column-resizer').hide();
            }
        },
        
        _initDraggableRows: function() {
            var $this = this;

            this.tbody.sortable({
                placeholder: 'ui-datatable-rowordering ui-state-active',
                cursor: 'move',
                handle: 'td,span:not(.ui-c)',
                appendTo: document.body,
                helper: function(event, ui) {
                    var cells = ui.children(),
                    helper = $('<div class="ui-datatable ui-widget"><table><tbody></tbody></table></div>'),
                    helperRow = ui.clone(),
                    helperCells = helperRow.children();

                    for(var i = 0; i < helperCells.length; i++) {
                        helperCells.eq(i).width(cells.eq(i).width());
                    }

                    helperRow.appendTo(helper.find('tbody'));

                    return helper;
                },
                update: function(event, ui) {
                    $this.syncRowParity();

                    $this._trigger('rowReorder', null, {
                        fromIndex: ui.item.data('ri'),
                        toIndex: $this._getFirst() + ui.item.index()
                    });
                },
                change: function(event, ui) {
                    if($this.options.scrollable) {
                        PUI.scrollInView($this.scrollBody, ui.placeholder);
                    }
                }
            });
        },

        syncRowParity: function() {
            var rows = this.tbody.children('tr.ui-widget-content');

            for(var i = this._getFirst(); i < rows.length; i++) {
                var row = rows.eq(i);

                row.data('ri', i).removeClass('ui-datatable-even ui-datatable-odd');

                if(i % 2 === 0)
                    row.addClass('ui-datatable-even');
                else
                    row.addClass('ui-datatable-odd');

            }
        },
        
        getContextMenuSelection: function(data) {
            return this.dataSelectedByContextMenu;
        },
        
        _initFiltering: function() {
            var $this = this;
            this.filterElements = this.thead.find('.ui-column-filter');
            
            this.filterElements.on('keyup', function() {
                        if($this.filterTimeout) {
                            clearTimeout($this.filterTimeout);
                        }

                        $this.filterTimeout = setTimeout(function() {
                            $this.filter();
                            $this.filterTimeout = null;
                        },
                        $this.options.filterDelay);
                    });
        },
        
        filter: function() {
            this.filterMetaMap = [];
                
            for(var i = 0; i < this.filterElements.length; i++) {
                var filterElement = this.filterElements.eq(i),
                filterElementValue = filterElement.val();

                if(filterElementValue && $.trim(filterElementValue) !== '') {
                    this.filterMetaMap.push({
                        field: filterElement.data('field'), 
                        filterMatchMode: filterElement.data('filtermatchmode'), 
                        value: filterElementValue.toLowerCase(),
                        element: filterElement
                    });
                }
            }
                
            if(this.options.lazy) {
                this.options.datasource.call(this, this._onLazyLoad, this._createStateMeta());
            }
            else {
                if(this.filterMetaMap.length) {
                    this.filteredData = [];
                    
                    for(var i = 0; i < this.data.length; i++) {
                        var localMatch = true;

                        for(var j = 0; j < this.filterMetaMap.length; j++) {
                            var filterMeta = this.filterMetaMap[j],
                            filterValue = filterMeta.value,
                            filterField = filterMeta.field,
                            dataFieldValue = this.data[i][filterField];
                    
                            if(filterMeta.filterMatchMode === 'custom') {
                                localMatch = filterMeta.element.triggerHandler('filter', [dataFieldValue, filterValue]);
                            }
                            else {
                                var filterConstraint = this.filterConstraints[filterMeta.filterMatchMode];
                                if(!filterConstraint(dataFieldValue, filterValue)) {
                                    localMatch = false;
                                }
                            }

                            if(!localMatch) {
                                break;
                            }
                        }

                        if(localMatch) {
                            this.filteredData.push(this.data[i]);
                        }
                    }
                }
                else {
                    this.filteredData = null;
                }

                if(this.paginator) {
                    this.paginator.puipaginator('option', 'totalRecords', this.filteredData ? this.filteredData.length : this.data ? this.data.length : 0);
                }
                
                this._renderData();
            }
        },
        
        filterConstraints: {
            
            startsWith: function(value, filter) {
                if(filter === undefined || filter === null || $.trim(filter) === '') {
                    return true;
                }
                
                if(value === undefined || value === null) {
                    return false;
                }
                
                return value.toString().toLowerCase().slice(0, filter.length) === filter;
            },
            
            contains: function(value, filter) {
                if(filter === undefined || filter === null || $.trim(filter) === '') {
                    return true;
                }
                
                if(value === undefined || value === null) {
                    return false;
                }
                
                return value.toString().toLowerCase().indexOf(filter) !== -1;
            }
            
        },
        
        _initStickyHeader: function() {
            var table = this.thead.parent(),
            offset = table.offset(),
            win = $(window),
            $this = this,
            stickyNS = 'scroll.' + this.id,
            resizeNS = 'resize.sticky-' + this.id; 

            this.cloneContainer = $('<div class="ui-datatable ui-datatable-sticky ui-widget"><table></table></div>');
            this.clone = this.thead.clone(true);
            this.cloneContainer.children('table').append(this.clone);

            this.cloneContainer.css({
                position: 'absolute',
                width: table.outerWidth(),
                top: offset.top,
                left: offset.left,
                'z-index': ++PUI.zindex
            })
            .appendTo(this.element);

            win.off(stickyNS).on(stickyNS, function() {
                var scrollTop = win.scrollTop(),
                tableOffset = table.offset();

                if(scrollTop > tableOffset.top) {
                    $this.cloneContainer.css({
                                            'position': 'fixed',
                                            'top': '0px'
                                        })
                                        .addClass('ui-shadow ui-sticky');

                    if(scrollTop >= (tableOffset.top + $this.tbody.height()))
                        $this.cloneContainer.hide();
                    else
                        $this.cloneContainer.show();
                }
                else {
                    $this.cloneContainer.css({
                                            'position': 'absolute',
                                            'top': tableOffset.top
                                        })
                                        .removeClass('ui-shadow ui-sticky');
                }
            })
            .off(resizeNS).on(resizeNS, function() {
                $this.cloneContainer.width(table.outerWidth());
            });

            //filter support
            this.thead.find('.ui-column-filter').prop('disabled', true);
        },
        
        _initEditing: function() {
            var cellSelector = '> tr > td.ui-editable-column',
            $this = this;
            
            this.tbody.off('click', cellSelector)
                        .on('click', cellSelector, null, function(e) {
                            var cell = $(this);
                            if(!cell.hasClass('ui-cell-editing')) {
                                $this._showCellEditor(cell);
                                e.stopPropagation();
                            }
                        });
        },
  
        _showCellEditor: function(cell) {
            var editor = this.editors[cell.data('editor')].call(),
            $this = this;
    
            editor.val(cell.data('rowdata')[cell.data('field')]);
            
            cell.addClass('ui-cell-editing').html('').append(editor);
            
            editor.focus().on('change', function() {
                $this._onCellEditorChange(cell);
            })
            .on('blur', function() {
                $this._onCellEditorBlur(cell);
            })
            .on('keydown', function(e) {
                var key = e.which,
                keyCode = $.ui.keyCode;

                if((key === keyCode.ENTER||key === keyCode.NUMPAD_ENTER)) {
                    $(this).trigger('change').trigger('blur');
                    e.preventDefault();
                }
                else if(key === keyCode.TAB) {
                    if(e.shiftKey) {
                        var prevCell = cell.prevAll('td.ui-editable-column').eq(0);
                        if(!prevCell.length) {
                            prevCell = cell.parent().prev('tr').children('td.ui-editable-column:last');
                        }
                        if(prevCell.length) {
                            $this._showCellEditor(prevCell);
                        }
                    }
                    else {
                        var nextCell = cell.nextAll('td.ui-editable-column').eq(0);
                        if(!nextCell.length) {
                            nextCell = cell.parent().next('tr').children('td.ui-editable-column').eq(0);
                        }
                        if(nextCell.length) {
                            $this._showCellEditor(nextCell);
                        }
                    }
                    
                    e.preventDefault();
                } else if(key === keyCode.ESCAPE) {
                    $this._onCellEditorBlur(cell);
                }
                
            });
        },
        
        _onCellEditorChange: function(cell) {
            var newCellValue = cell.children('.ui-cell-editor').val();
            
            var retVal = this._trigger('cellEdit', null, {
                oldValue: cell.data('rowdata')[cell.data('field')],
                newValue: newCellValue,
                data: cell.data('rowdata'),
                field: cell.data('field')
            });
            
            if(retVal !== false) {
                cell.data('rowdata')[cell.data('field')] = newCellValue;
            }
        },
        
        _onCellEditorBlur: function(cell) {
            cell.removeClass('ui-cell-editing').text(cell.data('rowdata')[cell.data('field')])
                    .children('.ui-cell-editor').remove();
        },

        reload: function() {
            this._updateDatasource(this.options.datasource);
        },

        getPaginator: function() {
            return this.paginator;
        },

        setTotalRecords: function(val) {
            this.paginator.puipaginator('option','totalRecords', val);
        },

        _createFilterMap: function() {
            var filters = null;
            if(this.filterElements) {
                filters = {};
                for(var i = 0; i < this.filterElements.length; i++) {
                    var filterElement = this.filterElements.eq(i),
                    value = filterElement.val();
                    if($.trim(value).length) {
                        filters[filterElement.data('field')] = value;
                    }
                }
            }

            return filters;
        },
        
        editors: {
            
            'input': function() {
                return $('<input type="text" class="ui-cell-editor"/>');
            }
        }
    
    });
})();

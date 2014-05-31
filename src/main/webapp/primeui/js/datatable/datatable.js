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
            caption: null,
            sortField: null,
            sortOrder: null,
            keepSelectionInLazyMode: false,
            scrollable: false
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            this.element.addClass('pui-datatable ui-widget');
            
            if(this.options.scrollable) {
                this._createScrollableDatatable();
            }
            else {
                this._createRegularDatatable();
            }
            
            if(this.options.datasource) {
                if($.isArray(this.options.datasource)) {
                    this.data = this.options.datasource;
                    this._initialize();
                }
                else if($.type(this.options.datasource) === 'function') {
                    if(this.options.lazy) {
                        this.options.datasource.call(this, this._onDataInit, {first:0, sortField:this.options.sortField, sortOrder:this.options.sortOrder});
                    }
                    else {
                        this.options.datasource.call(this, this._onDataInit);
                    }
                }
            }
        },
        
        _createRegularDatatable: function() {
            this.tableWrapper = $('<div class="pui-datatable-tablewrapper" />').appendTo(this.element);
            this.table = $('<table><thead></thead><tbody></tbody></table>').appendTo(this.tableWrapper);
            this.thead = this.table.children('thead');
            this.tbody = this.table.children('tbody').addClass('pui-datatable-data');
        },
        
        _createScrollableDatatable: function() {
            var $this = this;
            
            this.element.append('<div class="ui-widget-header pui-datatable-scrollable-header"><div class="pui-datatable-scrollable-header-box"><table><thead></thead></table></div></div>')
                        .append('<div class="pui-datatable-scrollable-body"><table><colgroup></colgroup><tbody></tbody></table></div></div>');
                
            this.thead = this.element.find('> .pui-datatable-scrollable-header thead');
            this.tbody = this.element.find('> .pui-datatable-scrollable-body tbody');
            this.colgroup = this.tbody.prev();
            
            if(this.options.columns) {
                $.each(this.options.columns, function(i, col) {
                    $('<col></col>').appendTo($this.colgroup);
                });
            }
        },
                
        _initialize: function() {
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
                    
                    if(col.sortable) {
                        header.addClass('pui-sortable-column')
                                .data('order', 0)
                                .append('<span class="pui-sortable-column-icon ui-icon ui-icon-carat-2-n-s"></span>');
                    }
                });
            }
            
            if(this.options.caption) {
                this.element.prepend('<div class="pui-datatable-caption ui-widget-header">' + this.options.caption + '</div>');
            }

            if(this.options.paginator) {
                this.options.paginator.paginate = function(event, state) {
                    $this.paginate();
                };
                
                this.options.paginator.totalRecords = this.options.paginator.totalRecords||this.data.length;
                this.paginator = $('<div></div>').insertAfter(this.tableWrapper).puipaginator(this.options.paginator);
            }

            if(this._isSortingEnabled()) {
                this._initSorting();
            }
            
            if(this.options.selectionMode) {
                this._initSelection();
            }

            if (this.options.sortField && this.options.sortOrder) {
                this._indicateInitialSortColumn();
                this.sort(this.options.sortField, this.options.sortOrder);
            } else {
                this._renderData();
            }
            
            if(this.options.scrollable) {
                this._initScrolling();
            }
        },

        _indicateInitialSortColumn: function() {
            var sortableColumns = this.thead.children('th.pui-sortable-column'),
                $this = this;
            $.each(sortableColumns, function(i, column) {
                var $column = $(column),
                    data = $column.data();
                if ($this.options.sortField === data.field) {
                    var sortIcon = $column.children('.pui-sortable-column-icon');
                    $column.data('order', $this.options.sortOrder).removeClass('ui-state-hover').addClass('ui-state-active');
                    if($this.options.sortOrder === -1)
                        sortIcon.removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');
                    else if($this.options.sortOrder === 1)
                        sortIcon.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');
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
                
            this._renderData();
        },
        
        _onLazyLoad: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
            
            this._renderData();
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
                sortField = column.data('field'),
                order = column.data('order'),
                sortOrder = (order === 0) ? 1 : (order * -1),
                sortIcon = column.children('.pui-sortable-column-icon');
                
                //clean previous sort state
                column.siblings().filter('.ui-state-active').data('order', 0).removeClass('ui-state-active').children('span.pui-sortable-column-icon')
                                                            .removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s');
                                                    
                //update state
                $this.options.sortField = sortField;
                $this.options.sortOrder = sortOrder;
    
                $this.sort(sortField, sortOrder);
                                
                column.data('order', sortOrder).removeClass('ui-state-hover').addClass('ui-state-active');
                if(sortOrder === -1)
                    sortIcon.removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');
                else if(sortOrder === 1)
                    sortIcon.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');
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
            }
        },
                
        sortByField: function(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase(); 
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        },
                
        _renderData: function() {
            if(this.data) {
                this.tbody.html('');
                
                var firstNonLazy = this._getFirst(),
                    first = this.options.lazy ? 0 : firstNonLazy,
                  rows = this._getRows();

                for(var i = first; i < (first + rows); i++) {
                    var rowData = this.data[i];
                    
                    if(rowData) {
                        var row = $('<tr class="ui-widget-content" />').appendTo(this.tbody),
                            zebraStyle = (i%2 === 0) ? 'pui-datatable-even' : 'pui-datatable-odd',
                            rowIndex = i;

                        row.addClass(zebraStyle);
                        if(this.options.lazy) {
                            rowIndex += firstNonLazy; // Selection is kept as it is non lazy data
                        }
                        if(this.options.selectionMode && PUI.inArray(this.selection, rowIndex)) {
                            row.addClass("ui-state-highlight");
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
                            
                            if(columnOptions.content) {
                                var content = columnOptions.content.call(this, rowData);
                                if($.type(content) === 'string')
                                    column.html(content);
                                else
                                    column.append(content);
                            }
                            else {
                                column.text(rowData[columnOptions.field]);
                            }                            
                        }
                    }
                }
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
            var index = row.index();
            
            return this.options.paginator ? this._getFirst() + index : index;
        },
                
        _createStateMeta: function() {
            var state = {
                first: this._getFirst(),
                rows: this._getRows(),
                sortField: this.options.sortField,
                sortOrder: this.options.sortOrder
            };
            
            return state;
        },
                
        _updateDatasource: function(datasource) {
            this.options.datasource = datasource;
            
            this.reset();
            
            if($.isArray(this.options.datasource)) {
                this.data = this.options.datasource;
                this._renderData();
            }
            else if($.type(this.options.datasource) === 'function') {
                if(this.options.lazy) {
                    this.options.datasource.call(this, this._onDataUpdate, {first:0, sortField:this.options.sortField, sortorder:this.options.sortOrder});
                }
                else {
                    this.options.datasource.call(this, this._onDataUpdate);
                }
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
                
        reset: function() {
            if(this.options.selectionMode) {
                this.selection = [];
            }
            
            if(this.paginator) {
                this.paginator.puipaginator('setPage', 0, true);
            }
            
            this.thead.children('th.pui-sortable-column').data('order', 0).filter('.ui-state-active').removeClass('ui-state-active')
                                .children('span.pui-sortable-column-icon').removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s');
        },
        
        _initScrolling: function() {
            this.scrollHeader = this.element.children('.pui-datatable-scrollable-header');
            this.scrollBody = this.element.children('.pui-datatable-scrollable-body');
            this.scrollHeaderBox = this.scrollHeader.children('div.pui-datatable-scrollable-header-box');
            this.headerTable = this.scrollHeaderBox.children('table');
            this.bodyTable = this.scrollBody.children('table');
            this.percentageScrollHeight = this.options.scrollHeight && (this.options.scrollHeight.indexOf('%') !== -1);
            this.percentageScrollWidth = this.options.scrollWidth && (this.options.scrollWidth.indexOf('%') !== -1);
            var $this = this,
            scrollBarWidth = this.getScrollbarWidth() + 'px';

            if(this.options.scrollHeight) {
                this.scrollBody.height(this.options.scrollHeight);
                this.scrollHeaderBox.css('margin-right', scrollBarWidth);

                if(this.percentageScrollHeight) {
                    this.adjustScrollHeight();
                }
            }

            this.fixColumnWidths();

            if(this.options.scrollWidth) {
                if(this.percentageScrollWidth)
                    this.adjustScrollWidth();
                else
                    this.setScrollWidth(this.options.scrollWidth);
            }

            this.scrollBody.on('scroll.dataTable', function() {
                var scrollLeft = $this.scrollBody.scrollLeft();
                $this.scrollHeaderBox.css('margin-left', -scrollLeft);
            });

            this.scrollHeader.on('scroll.dataTable', function() {
                $this.scrollHeader.scrollLeft(0);
            });

            var resizeNS = 'resize.' + this.id;
            $(window).unbind(resizeNS).bind(resizeNS, function() {
                if($this.element.is(':visible')) {
                    if($this.percentageScrollHeight)
                        $this.adjustScrollHeight();

                    if($this.percentageScrollWidth)
                        $this.adjustScrollWidth();
                }
            });
        },

        adjustScrollHeight: function() {
            var relativeHeight = this.element.parent().innerHeight() * (parseInt(this.options.scrollHeight) / 100),
            tableHeaderHeight = this.element.children('.pui-datatable-caption').outerHeight(true),
            scrollersHeight = this.scrollHeader.outerHeight(true),
            paginatorsHeight = this.paginator ? this.paginator.getContainerHeight(true) : 0,
            height = (relativeHeight - (scrollersHeight + paginatorsHeight + tableHeaderHeight));

            this.scrollBody.height(height);
        },

        adjustScrollWidth: function() {
            var width = parseInt((this.element.parent().innerWidth() * (parseInt(this.options.scrollWidth) / 100)));
            this.setScrollWidth(width);
        },

        setScrollWidth: function(width) {
            this.scrollHeader.width(width);
            this.scrollBody.css('margin-right', 0).width(width);
            this.element.width(width);
        },

        getScrollbarWidth: function() {
            if(!this.scrollbarWidth) {
                this.scrollbarWidth = PUI.browser.webkit ? '15' : PUI.calculateScrollbarWidth();
            }

            return this.scrollbarWidth;
        },

        fixColumnWidths: function() {
            var $this = this;

            if(!this.columnWidthsFixed) {
                if(this.options.scrollable) {
                    this.thead.children('th').each(function() {
                        var headerCol = $(this),
                        colIndex = headerCol.index(),
                        width = headerCol.width(),
                        innerWidth = headerCol.innerWidth(),
                        cellWidth = innerWidth + 1;

                        headerCol.width(width);
                        $this.colgroup.children().eq(colIndex).width(cellWidth);
                    });
                }
                else {
                    this.element.find('> .pui-datatable-tablewrapper > table > thead > tr > th').each(function() {
                        var col = $(this);
                        col.width(col.width());
                    });
                }

                this.columnWidthsFixed = true;
            }
        }
    });
});
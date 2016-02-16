if(!xtag.tags['p-datatable']) {

    xtag.register('p-datatable', {

        accessors: {
            datasource: {
                attribute: {}
            },
            paginator: {
                attribute: {
                    boolean: true
                }
            },
            rows: {
                attribute: {}
            },
            totalrecords: {
                attribute: {}
            },
            selectionmode: {
                attribute: {}
            },
            caption: {
                attribute: {}
            },
            footer: {
                attribute: {}
            },
            sortfield: {
                attribute: {}
            },
            sortorder: {
                attribute: {}
            },
            keepSelectionInLazyMode: {
                attribute: {}
            },
            scrollable: {
                attribute: {
                    boolean: true
                }
            },
            scrollheight: {
                attribute: {}
            },
            scrollwidth: {
                attribute: {}
            },
            responsive: {
                attribute: {
                    boolean: true
                }
            },
            expandablerows: {
                attribute: {
                    boolean: true
                }
            },
            rowexpandmode: {
                attribute: {}
            },
            draggablecolumns: {
                attribute: {
                    boolean: true
                }
            },
            draggablerows: {
                attribute: {
                    boolean: true
                }
            },
            resizablecolumns: {
                attribute: {
                    boolean: true
                }
            },
            columnresizemode: {
                attribute: {}
            },
            filterdelay: {
                attribute: {}
            },
            stickyheader: {
                attribute: {
                    boolean: true
                }
            },
            editmode: {
                attribute: {}
            },
            tabindex: {
                attribute: {}
            },
            onsort: {
                attribute: {}
            },
            onrowselect: {
                attribute: {}
            },
            onrowunselect: {
                attribute: {}
            },
            onrowselectcontextmenu: {
                attribute: {}
            },
            onrowcollapse: {
                attribute: {}
            },
            onrowexpand: {
                attribute: {}
            },
            oncolreorder: {
                attribute: {}
            },
            oncolresize: {
                attribute: {}
            },
            onrowreorder: {
                attribute: {}
            },
            oncelledit: {
                attribute: {}
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
                    col.sortable = columnElement.attr('sortable')  !== undefined;
                    col.headerStyle = columnElement.attr('headerstyle');
                    col.headerClass = columnElement.attr('headerclass');
                    col.bodyStyle = columnElement.attr('bodystyle');
                    col.bodyClass = columnElement.attr('bodyclass');
                    col.colspan = columnElement.attr('colspan');
                    col.rowspan = columnElement.attr('rowspan');
                    col.filter = columnElement.attr('filter') !== undefined;
                    col.filterMatchMode = columnElement.attr('filtermatchmode');
                    col.filterFunction = PUI.resolveObjectByName(columnElement.attr('filterfunction'))
                    col.editor = columnElement.attr('editor') !== undefined;
                    col.rowToggler = columnElement.attr('rowToggler') !== undefined;

                    if(columnElement.children('template').length) {
                        col.contentTemplate = columnElement.children('template').html();
                        col.content = function(data, _col) {
                            return Mustache.render(_col.contentTemplate, data);
                        };
                    }

                    cols.push(col);
                }

                $(this.xtag.container).puidatatable({
                    datasource: PUI.resolveObjectByName(this.datasource)||this.datasource,
                    columns: cols,
                    paginator: this.paginator ? {rows: this.rows ? parseInt(this.rows) : 0, totalRecords: this.totalrecords ? parseInt(this.totalrecords) : 0} : null,
                    selectionMode: this.selectionmode,
                    caption: this.caption,
                    footer: this.footer,
                    sortField: this.sortfield,
                    sortorder: this.sortorder,
                    keepSelectionInLazyMode: this.keepselectioninlazymode,
                    scrollable: this.scrollable,
                    scrollHeight: this.scrollheight,
                    scrollWidth: this.scrollwidth,
                    responsive: this.responsive,
                    expandableRows: this.expandablerows,
                    rowExpandMode: this.rowexpandmode||'multiple',
                    draggableColumns: this.draggablecolumns,
                    draggableRows: this.draggablerows,
                    resizableColumns: this.resizablecolumns,
                    columnResizeMode: this.columnresizemode,
                    filterDelay: this.filterDelay ? parseInt(this.filterDelay) : 300,
                    stickyHeader: this.stickyheader,
                    editMode: this.editmode,
                    tabindex: this.tabindex||0,
                    sort: this.onsort ? function(event, ui) {PUI.executeFunctionByName($this.onsort, event, ui);} : null,
                    rowSelect: this.onrowselect ? function(event, ui) {PUI.executeFunctionByName($this.onrowselect, event, ui);} : null,
                    rowUnselect: this.onrowunselect ? function(event, ui) {PUI.executeFunctionByName($this.onrowunselect, event, ui);} : null,
                    rowSelectContextMenu: this.onrowselectcontextmenu ? function(event, ui) {PUI.executeFunctionByName($this.onrowselectcontextmenu, event, ui);} : null,
                    rowExpand: this.onrowexpand ? function(event, ui) {PUI.executeFunctionByName($this.onrowexpand, event, ui);} : null,
                    rowCollapse: this.onrowcollapse ? function(event, ui) {PUI.executeFunctionByName($this.onrowcollapse, event, ui);} : null,
                    colReorder: this.oncolreorder ? function(event, ui) {PUI.executeFunctionByName($this.oncolreorder, event, ui);} : null,
                    colResize: this.oncolresize ? function(event, ui) {PUI.executeFunctionByName($this.oncolresize, event, ui);} : null,
                    rowReorder: this.onrowreorder ? function(event, ui) {PUI.executeFunctionByName($this.onrowreorder, event, ui);} : null,
                    cellEdit: this.oncelledit ? function(event, ui) {PUI.executeFunctionByName($this.oncelledit, event, ui);} : null
                });
            }
        },

        methods: {
            reload: function() {
                $(this.xtag.container).puidatatable('reload');
            },
            setTotalRecords: function(val) {
                $(this.xtag.container).puidatatable('totalRecords', val);
            }
        }
        
    });

}

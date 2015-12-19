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
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this),
                columnElements = element.children('p-column'),
                cols = [];
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
                    col.filter = columnElement.attr('filter') !== undefined;
                    col.filterMatchMode = columnElement.prop('filtermatchmode');
                    col.filterFunction = PUI.resolveObjectByName(columnElement.prop('filterfunction'))
                    col.editor = columnElement.prop('editor') !== undefined;
                    col.rowToggler = columnElement.prop('rowToggler') !== undefined;

                    cols.push(col);
                }

                $(this.xtag.container).puidatatable({
                    datasource: PUI.resolveObjectByName(this.datasource),
                    columns: cols,
                    paginator: this.paginator ? {rows: this.rows ? parseInt(this.rows) : 0} : null,
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
                    tabindex: this.tabindex||0
                });
            }
        }
        
    });

}
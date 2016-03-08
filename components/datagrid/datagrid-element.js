if(!xtag.tags['p-datagrid']) {

    xtag.register('p-datagrid', {

        accessors: {
            columns: {
                attribute: {}
            },
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
            header: {
                attribute: {}
            },
            footer: {
                attribute: {}
            },
            lazy: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $(this).append('<div></div>').children('div');

                $(this.xtag.container).puidatagrid({
                    header: this.header,
                    footer: this.footer,
                    lazy: this.lazy,
                    columns: this.columns||3,
                    paginator: this.paginator ? {rows: this.rows ? parseInt(this.rows) : 0, totalRecords: this.totalrecords ? parseInt(this.totalrecords) : 0} : null,
                    datasource: PUI.resolveObjectByName(this.datasource)||this.datasource,
                    template: $(this).children('template')
                });
            }
        }
    });
    
}
if(!xtag.tags['p-paginator']) {
 
    xtag.register('p-paginator', {
    
        accessors: {
            pagelinks: {
                attribute: {}
            },
            totalrecords: {
                attribute: {}
            },
            page: {
                attribute: {}
            },
            rows: {
                attribute: {}
            },
            template: {
                attribute: {}
            },
            onpaginate: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $(this).append('<div></div>').children('div');               
                var $this = this;
                
                $(this.xtag.container).puipaginator({
                    pageLinks: this.pagelinks ? parseInt(this.pagelinks) : 5,
                    totalRecords: this.totalrecords ? parseInt(this.totalrecords) : 0,
                    page: this.page ? parseInt(this.page) : 0,
                    rows: this.rows ? parseInt(this.rows) : 0,
                    template: this.template||'{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}',
                    paginate: this.onpaginate ? function(event, param) {PUI.executeFunctionByName($this.onpaginate, event, param);} : null
                });
            }
        },
        
        methods: {
            setPage: function(page, silent) {
                $(this.xtag.container).puipaginator('setPage', page, silent);
            }
        }
        
    });
    
}
if(!xtag.tags['p-datascroller']) {

    xtag.register('p-datascroller', {

        accessors: {
            header: {
                attribute: {}
            },
            datasource: {
                attribute: {}
            },
            lazy: {
                attribute: {
                    boolean: true
                }
            },
            chunksize: {
                attribute: {}
            },
            mode: {
                attribute: {}
            },
            loader: {
                attribute: {}
            },
            scrollheight: {
                attribute: {}
            },
            totalsize: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $(this).append('<div></div>').children('div');

                $(this.xtag.container).puidatascroller({
                    header: this.header,
                    datasource: PUI.resolveObjectByName(this.datasource),
                    lazy: this.lazy,
                    chunkSize: this.chunksize ? parseInt(this.chunksize): 10,
                    mode: this.mode||'document',
                    loader: this.loader ? $('#' + loader) : null,
                    scrollHeight: this.scrollheight ? parseInt(this.scrollheight) : null,
                    template: $(this).children('template'),
                    totalSize: this.totalsize  ? parseInt(this.totalsize) : null
                });
            }
        }
    });
    
}
if(!xtag.tags['p-column']) {

    xtag.register('p-column', {

        accessors: {
            field: {
                attribute: {}
            },
            headertext: {
                attribute: {}
            },
            footertext: {
                attribute: {}
            },
            sortable: {
                attribute: {
                    boolean: true
                }
            },
            headerstyle: {
                attribute: {}
            },
            headerclass: {
                attribute: {}
            },
            bodystyle: {
                attribute: {}
            },
            bodyclass: {
                attribute: {}
            },
            colspan: {
                attribute: {}
            },
            rowspan: {
                attribute: {}
            },
            filter: {
                attribute: {}
            },
            filtermatchmode: {
                attribute: {}
            },
            filterfunction: {
                attribute: {}
            },
            editor: {
                attribute: {}
            },
            rowtoggler: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                
            }
        }
        
    });

}
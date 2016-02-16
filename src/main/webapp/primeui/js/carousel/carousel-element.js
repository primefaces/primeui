if(!xtag.tags['p-carousel']) {

    xtag.register('p-carousel', {

        accessors: {
            datasource: {
                attribute: {}
            },
            numvisible: {
                attribute: {}
            },
            firstvisible: {
                attribute: {}
            },
            headertext: {
                attribute: {}
            },
            effectduration: {
                attribute: {}
            },
            circular: {
                attribute: {}
            },
            breakpoint: {
                attribute: {}
            },
            responsive: {
                attribute: {}
            },
            autoplayinterval: {
                attribute: {}
            },
            easing: {
                attribute: {}
            },
            pagelinks: {
                attribute: {}
            },
            onpagechange: {
                attribute: {}
            },
            renderdelay: {
                attribute: {}
            },
            style: {
                attribute: {}
            },
            styleclass: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;
                
                if(this.renderdelay) {
                    setTimeout(function() {
                        $this.render();
                    }, parseInt(this.renderdelay));
                }
                else {
                    this.render();
                }
            }
        },
        methods: {
            render: function() {
                 this.xtag.container = $(this).prepend('<ul></ul>').children('ul');
                
                var $this = this;
                $(this.xtag.container).puicarousel({
                    datasource: this.datasource ? PUI.resolveObjectByName(this.datasource): null,
                    numVisible: this.numvisible ? parseInt(this.numvisible) : 3,
                    firstVisible: this.firstvisible ? parseInt(this.firstvisible) : 0,
                    headerText: this.headertext,
                    effectduration: this.effectduration ? parseInt(this.effectduration) : 500,
                    circular: this.circular,
                    breakpoint: this.breakpoint ? parseInt(this.breakpoint) : 560,
                    responsive: this.responsive ? JSON.parse(this.responsive) : true,
                    autoplayInterval: this.autoplayinterval ? parseInt(this.autoplayinterval) : 0,
                    easing: this.easing||'easeInOutCirc',
                    pageLinks: this.pagelinks ? parseInt(this.pagelinks): 3,
                    template: $(this).children('template'),
                    pageChange: this.onpagechange ? function(event, param) {PUI.executeFunctionByName($this.onpagechange, event, param);} : null,
                    style: this.style,
                    styleClass: this.styleClass
                });
            }
        }
    });
    
}
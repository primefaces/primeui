if(!xtag.tags['p-accordion']) {
    
    xtag.register('p-accordion', {

        accessors: {
            activeindex: {
                attribute: {}
            },
            multiple: {
                attribute: {
                    boolean: true
                }
            },
            onchange: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this),
                tabs = $(this).children('p-tab'),
                $this = this;

                element.append('<div></div>');

                this.xtag.container = element.children('div');

                for(var i = 0; i < tabs.length; i++) {
                    var tab = tabs.eq(i),
                    title = tab.attr('title')||'';

                    this.xtag.container.append('<h3>' + title + '</h3>').append();
                    $('<div></div>').append(tab.contents()).appendTo(this.xtag.container);
                }

                this.xtag.container.puiaccordion({
                    activeIndex: this.activeindex||0,
                    orientation: this.orientation||'top',
                    change: this.onchange ? function(event, panel){PUI.executeFunctionByName($this.onchange, event, panel);} : null
                });
            }
        },

        methods: {
            select: function(index) {
                this.xtag.container.puiaccordion('select', index);
            },
            unselect: function(index) {
                this.xtag.container.puiaccordion('unselect', index);
            }
        }

    });
    
}
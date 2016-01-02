if(!xtag.tags['p-tabview']) {

    xtag.register('p-tabview', {

        accessors: {
            activeindex: {
                attribute: {}
            },
            orientation: {
                attribute: {}
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

                element.append('<div><ul></ul><div></div></div>');

                this.xtag.container = element.children('div');
                
                var headerContainer = this.xtag.container.children('ul'),
                bodyContainer = this.xtag.container.children('div');

                //headers
                for(var i = 0; i < tabs.length; i++) {
                    var tab = tabs.eq(i),
                    title = tab.attr('title')||'';

                    headerContainer.append('<li><a href="#">' + title + '</a></li>');
                }

                //contents
                for(var i = 0; i < tabs.length; i++) {
                    var tab = tabs.eq(i);

                    $('<div></div>').append(tab.contents()).appendTo(bodyContainer);
                }

                this.xtag.container.puitabview({
                    activeIndex: this.activeindex||0,
                    orientation: this.orientation||'top',
                    change: this.onchange ? function(event, index){PUI.executeFunctionByName($this.onchange, event, index);} : null
                });
            }
        },
        
        methods: {
            select: function(index) {
                this.xtag.container.puitabview('select', index);
            },
            remove: function(index) {
                this.xtag.container.puitabview('remove', index);
            },
            enable: function(index) {
                this.xtag.container.puitabview('enable', index);
            },
            disable: function(index) {
                this.xtag.container.puitabview('disable', index);
            },
            getActiveIndex: function(index) {
                return this.xtag.container.puitabview('getActiveIndex');
            }
        }

    });

}
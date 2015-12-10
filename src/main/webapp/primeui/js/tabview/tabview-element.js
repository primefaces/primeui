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
            
            var container = element.children('div'),
            headerContainer = container.children('ul'),
            bodyContainer = container.children('div');

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
            
            container.puitabview({
                activeIndex: this.activeindex||0,
                orientation: this.orientation||'top',
                change: this.onchange ? function(event, index){PUI.executeFunctionByName($this.onchange, event, index);} : null
            });
        }
        
    },
    
    methods: {

    }
    
});
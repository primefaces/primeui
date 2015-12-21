if(!xtag.tags['p-splitbutton']) {
 
    xtag.register('p-splitbutton', {
    

        accessors: {
            icon: {
                attribute:{}
            },
            iconPos: {
                attribute:{}
            }
            
        },
        lifecycle: {
            created: function() {
                this.xtag.container = $('<button></button>').appendTo(this);
                var element = $(this),
                menuitems = element.children('p-menuitem');
                var items = [];
                this.xtag.container.on('click.p-splitbutton', function() {
                    alert('Saved!')
                });
                for (var i = 0; i < menuitems.length; i++) {
                    var menuitem = menuitems.eq(i),
                    icon = menuitem.attr('icon'),
                    text = menuitem.attr('text'),
                    value = this.xtag.container.attr('text');



                    if(icon) {
                        menuitem.text(icon);
                    }

                    if(text) {
                        menuitem.text(text);
                    }

                    if(value) {
                        this.xtag.container.text(value);
                    }

                    items.push({icon: icon,text:text});
                };
                
                menuitems.remove();

                $(this.xtag.container).puisplitbutton({
                    icon : this.icon || null,
                    iconPos : this.iconPos,
                    items : items
                });
            }
        },

        methods: {
            disable: function() {
                $(this).puisplitbutton('disable');
            },
            enable: function() {
                $(this).puisplitbutton('enable');
            },
            show: function() {
                $(this).puisplitbutton('show');
            },
            hide: function() {
                $(this).puisplitbutton('hide');
            }
        }
        
    });
    
}
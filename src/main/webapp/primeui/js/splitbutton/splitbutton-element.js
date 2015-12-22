if(!xtag.tags['p-splitbutton']) {
 
    xtag.register('p-splitbutton', {
    

        accessors: {
            icon: {
                attribute:{}
            },
            iconPos: {
                attribute:{}
            },
            label: {
                attribute:{}
            },
            name: {
                attribute:{}
            },
            onclick: {
                attribute:{}
            }
        },
        
        lifecycle: {
            created: function() {
                var element = $(this),
                menuitemElements = element.children('p-menuitem'),
                menuitems = [];
                
                this.xtag.container = element.append('<button></button>').children('button');
                if(this.name) {
                    this.xtag.container.attr('name', this.name);
                }
                
                if(this.label) {
                    this.xtag.container.text(this.label);
                }

                for (var i = 0; i < menuitemElements.length; i++) {
                    var menuitem = menuitemElements.eq(i),
                    itemClick = menuitem.attr('onclick'),
                    item = {};

                    item.icon = menuitem.attr('icon')||null;
                    item.text = menuitem.attr('text')||null;
                    item.url = menuitem.attr('url')||null;
                    item.click = itemClick ? PUI.resolveObjectByName(itemClick): null;

                    menuitems.push(item);
                };
                
                menuitemElements.remove();

                $(this.xtag.container).puisplitbutton({
                    icon: this.icon,
                    iconPos: this.iconPos||'left',
                    items: menuitems,
                    click: this.onclick ? PUI.resolveObjectByName(this.onclick) : null
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
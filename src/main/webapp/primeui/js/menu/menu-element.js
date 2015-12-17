if(!xtag.tags['p-submenu']) {
 
    xtag.register('p-submenu', {
    
        accessors: {
            value: {
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                
            }
        }
        
    });
    
}

if(!xtag.tags['p-menuitem']) {
 
    xtag.register('p-menuitem', {
    
        accessors: {
            value: {
                attribute: {}
            },
            icon: {
                attribute: {}
            },
            href: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                
            }
        }
        
    });
    
}

if(!xtag.tags['p-menu']) {
 
    xtag.register('p-menu', {
    
        accessors: {
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $('<ul></ul>').appendTo(this);
                
                var iterateChildren = function(parent) {
                    var children = parent.children();

                    for(var i = 0; i < children.length; i++) {
                        var childElement = children.eq(i),
                        tagname = childElement.get(0).tagName.toLowerCase();

                        if(tagname === 'p-submenu') {
                            var submenu = $('<h3></h3>'),
                            value = childElement.attr('value');
                    
                            if(value) 
                                submenu.text(value);
                    
                            this.xtag.container.append($('<li></li').append(submenu));
                            
                            iterateChildren.call(this, childElement);
                        }
                        else if(tagname === 'p-menuitem') {
                            var menuitem = $('<a></a>'),
                            icon = childElement.attr('icon'),
                            value = childElement.attr('value');

                            if(icon) 
                                menuitem.data('icon', icon);
                            
                            if(value) 
                                menuitem.text(value);

                            this.xtag.container.append($('<li></li').append(menuitem));
                        }
                    }
                };
                
                iterateChildren.call(this, $(this));

                $(this.xtag.container).puimenu();
            },
            
            
        }
        
    });
    
}

if(!xtag.tags['p-breadcrumb']) {
 
    xtag.register('p-breadcrumb', {
    
        accessors: {

        },

        lifecycle: {
            created: function() {
                this.xtag.container = $('<ul></ul>').appendTo(this);

                var element = $(this),
                menuitems = element.children('p-menuitem');

                for (var i = 0; i < menuitems.length; i++) {
                    var menuitem = menuitems.eq(i),
                    anchor = $('<a></a>'),
                    value = menuitem.attr('value'),
                    href = menuitem.attr('href');
                    
                    if(value) {
                        anchor.text(value);
                    }
                    
                    if(href) {
                        anchor.attr('href', href);
                    }
            
                    this.xtag.container.append($('<li></li').append(anchor));
                }; 
                
                menuitems.remove();
                
                $(this.xtag.container).puibreadcrumb();
            }
        }
        
    });
    
}
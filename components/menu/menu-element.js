PUI.createNestedMenuDom = function(tag, element) {
    var children = tag.children();

    for(var i = 0; i < children.length; i++) {
        var childTag = children.eq(i),
        childTagname = childTag.get(0).tagName.toLowerCase();

        if(childTagname === 'p-submenu') {
            var submenuDom = $('<li></li>'),
            submenuLink = $('<a></a>'),
            value = childTag.attr('value'),
            icon = childTag.attr('icon');

            if(value) submenuLink.text(value);
            if(icon) submenuLink.data('icon', icon);

            submenuDom.append(submenuLink).append('<ul></ul>').appendTo(element);

            PUI.createNestedMenuDom.call(this, childTag, submenuDom.children('ul'));
        }
        else if(childTagname === 'p-menuitem') {
            var menuitemDom = $('<a></a>'),
            icon = childTag.attr('icon'),
            value = childTag.attr('value'),
            href = childTag.attr('href');

            if(icon) 
                menuitemDom.data('icon', icon);

            if(value) 
                menuitemDom.text(value);

            if(href)
                menuitemDom.attr('href',href);

            element.append($('<li></li').append(menuitemDom));
        }
    }
};

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
            popup: {
                attribute: {
                    boolean: true
                }
            },
            trigger: {
                attribute: {}
            },
            my: {
                attribute: {}
            },
            at: {
                attribute: {}
            },
            triggerevent: {
                attribute: {}
            }
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

                $(this.xtag.container).puimenu({
                    popup: this.popup,
                    trigger: this.trigger ? '#' + this.trigger : null,
                    my: this.my||'left top',
                    at: this.at||'left bottom',
                    triggerEvent: this.triggerEvent||'click'
                });
            }

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

if(!xtag.tags['p-menubar']) {
 
    xtag.register('p-menubar', {
    
        accessors: {
            autodisplay: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this);
                this.xtag.container = $('<ul></ul>').appendTo(this);
                                
                PUI.createNestedMenuDom.call(this, element, this.xtag.container);
                element.children('p-submenu,p-menuitem').remove();

                $(this.xtag.container).puimenubar({
                    autoDisplay: this.autodisplay ? JSON.parse(this.autodisplay): true
                });
            }
        }
        
    });
    
}

if(!xtag.tags['p-tieredmenu']) {
 
    xtag.register('p-tieredmenu', {
    
        accessors: {
            popup: {
                attribute: {
                    boolean: true
                }
            },
            trigger: {
                attribute: {}
            },
            my: {
                attribute: {}
            },
            at: {
                attribute: {}
            },
            triggerevent: {
                attribute: {}
            },
            autodisplay: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this);
                this.xtag.container = $('<ul></ul>').appendTo(this);
                                
                PUI.createNestedMenuDom.call(this, element, this.xtag.container);
                element.children('p-submenu,p-menuitem').remove();

                $(this.xtag.container).puitieredmenu({
                    popup: this.popup,
                    trigger: this.trigger ? '#' + this.trigger : null,
                    my: this.my||'left top',
                    at: this.at||'left bottom',
                    triggerEvent: this.triggerEvent||'click',
                    autoDisplay: this.autodisplay ? JSON.parse(this.autodisplay): true
                });
            }
        }
        
    });
    
}

if(!xtag.tags['p-slidemenu']) {
 
    xtag.register('p-slidemenu', {
    
        accessors: {
            popup: {
                attribute: {
                    boolean: true
                }
            },
            trigger: {
                attribute: {}
            },
            my: {
                attribute: {}
            },
            at: {
                attribute: {}
            },
            triggerevent: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this);
                this.xtag.container = $('<ul></ul>').appendTo(this);
                                
                PUI.createNestedMenuDom.call(this, element, this.xtag.container);
                element.children('p-submenu,p-menuitem').remove();

                $(this.xtag.container).puislidemenu({
                    popup: this.popup,
                    trigger: this.trigger ? '#' + this.trigger : null,
                    my: this.my||'left top',
                    at: this.at||'left bottom',
                    triggerEvent: this.triggerEvent||'click'
                });
            }
        }
        
    });
    
}

if(!xtag.tags['p-contextmenu']) {
 
    xtag.register('p-contextmenu', {
    
        accessors: {
            autodisplay: {
                attribute: {}
            },
            target: {
                attribute: {}
            },
            event: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this);
                this.xtag.container = $('<ul></ul>').appendTo(this);
                                
                PUI.createNestedMenuDom.call(this, element, this.xtag.container);
                element.children('p-submenu,p-menuitem').remove();

                $(this.xtag.container).puicontextmenu({
                    autoDisplay: this.autodisplay ? JSON.parse(this.autodisplay): true,
                    target: this.target||document,
                    event: this.event||'contextmenu'
                });
            }
        }
        
    });
    
}


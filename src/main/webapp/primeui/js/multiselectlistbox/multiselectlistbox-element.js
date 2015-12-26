if(!xtag.tags['p-option']) {
 
    xtag.register('p-option', {
    
        accessors: {
            label: {
                attribute:{}
            },
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
if(!xtag.tags['p-optgroup']) {
 
    xtag.register('p-optgroup', {
    
        accessors: {
            label: {
                attribute:{}
            },
            items: {
                    attribute:{}
            }
        },
            

        lifecycle: {
            created: function() {
                
            }
        }
        
    });
    
}
if(!xtag.tags['p-multiselectlistbox']) {
 
    xtag.register('p-multiselectlistbox', {

        accessors: {
            caption: {
                attribute: {}
            },
            choices: {
                attribute: {}
            },
            effect: {
                attribute: {}
            },
            name : {
                attribute: {}
            },
            triggerevent: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.container = $('<div></div>').appendTo(this);
                var choices = [];

                var iterateChildren = function(parent) {
                    var children = parent.children();
                    for(var i = 0; i < children.length; i++) {
                        var childElement = children.eq(i),
                        item = {},
                        item2 = {};
                        tagname = childElement.get(0).tagName.toLowerCase();

                        if(tagname === 'p-optgroup') {
                           item.label = children.eq(i).attr('label')||null;
                           item.items = children.eq(i).attr('items')||null;
                           choices.push(item);
                           iterateChildren.call(this, childElement);
                        }
                        else if(tagname === 'p-option') {
                            item.label = children.eq(i).attr('label')||null;
                            item.value = children.attr('value')||null;
                            choices.push(item);
                        }
                    }
                };

                iterateChildren.call(this, $(this));

                $(this.xtag.container).puimultiselectlistbox({
                    caption: this.caption || null,
                    choices: choices,
                    effect: this.effect || 'fade',
                    name: this.name,
                    triggerEvent: this.triggerEvent||'click'
                });

                
            }
        },

        methods: {
            disable: function() {
                $(this).puimultiselectlistbox('disable');
            },
            enable: function() {
                $(this).puimultiselectlistbox('enable');
            },
            showOptionGroup: function() {
                $(this).puimultiselectlistbox('showOptionGroup');
            },
            getValue : function() {
                $(this).puimultiselectlistbox('getValue');
            }
        }
        
    });
    
}
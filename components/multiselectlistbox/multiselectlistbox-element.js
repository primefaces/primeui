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
            },
            value: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {                
                var items = [];

                var iterateChildren = function(element, arr) {
                    var children = element.children();
                    for(var i = 0; i < children.length; i++) {
                        var child = children.eq(i),
                        childTagname = child.get(0).tagName.toLowerCase(),
                        itemObj = {};
                
                        if(childTagname === 'optgroup') {
                            itemObj.label = child.attr('label');
                            itemObj.items = [];
                            iterateChildren(child, itemObj.items);
                        }
                        else if(childTagname === 'option') {
                            itemObj.value = child.attr('value');
                            itemObj.label = child.text();
                        }
                        
                        arr.push(itemObj);
                    }
                };

                iterateChildren($(this), items);
                
                $(this).children().remove();
                
                this.xtag.container = $('<div></div>').appendTo(this);

                $(this.xtag.container).puimultiselectlistbox({
                    caption: this.caption||null,
                    choices: items,
                    effect: this.effect||'fade',
                    name: this.name,
                    triggerEvent: this.triggerEvent||'click',
                    value: this.value
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
            getValue : function() {
                $(this).puimultiselectlistbox('getValue');
            }
        }
        
    });
    
}
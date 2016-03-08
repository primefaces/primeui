if(!xtag.tags['p-selectbutton']) {
 
    xtag.register('p-selectbutton', {
    
        accessors: {
            name:{
                attribute:{}
            },
            unselectable:{
                attribute:{
                    boolean:true
                }
            },
            tabindex:{
                attribute:{}
            },
            multiple:{
                attribute:{
                    boolean:true
                }
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this),
                elementOptions = element.children('option');
        
                this.xtag.container = $('<div></div>').appendTo(element);

                var choices = [];
                for (var i = 0 ; i < elementOptions.length; i++) {
                    var elementOption = elementOptions.eq(i);
                    choices.push({label:elementOption.text(),value:elementOption.val()});
                };
                
                elementOptions.remove();
                
                $(this.xtag.container).puiselectbutton({
                    choices: choices,
                    formfield: element.attr('name'),
                    unselectable: this.unselectable,
                    tabindex: this.tabindex||'0',
                    multiple: this.multiple
                });

            }
        },

        methods: {
            selectOption: function(value) {
                $(this).puiselectbutton('selectOption', value);
            },
            unselectOption: function(value) {
                $(this).puiselectbutton('unselectOption', value);
            }
        }
        
    });
    
}
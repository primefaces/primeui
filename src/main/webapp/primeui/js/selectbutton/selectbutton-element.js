if(!xtag.tags['p-selectbutton']) {
 
    xtag.register('p-selectbutton', {
    
        accessors: {
            choices:{
                attribute:{}
            },
            formfield:{
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
                this.xtag.selectbutton = $('<div></div>').appendTo(this);

                var element = $(this),
                $this = this,
                elementOptions = element.children('option');
                var choices = [];
                for (var i = 0 ; i < elementOptions.length; i++) {
                    var elementOption = elementOptions.eq(i);
                    choices.push({label:elementOption.text(),value:elementOption.val()});
                };
                this.xtag.selectbutton.puiselectbutton({
                    choices: this.choices || null,
                    formfield: this.formfield || null,
                    unselectable: this.unselectable || false,
                    tabindex: this.tabindex || '0',
                    multiple: this.multiple || false
                })
               

            }
        },

        methods: {
            disable: function() {
                $(this).puiselectbutton('disable');
            },
            enable: function() {
                $(this).puiselectbutton('enable');
            },
            selectOption: function() {
                $(this).puiselectbutton('selectOption');
            },
            unselectOption: function() {
                $(this).puiselectbutton('unselectOption');
            }
        }
        
    });
    
}
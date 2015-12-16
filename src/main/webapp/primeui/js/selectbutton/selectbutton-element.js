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
                $this = this;
                if(element.children('option')) {
                    var i = 0;
                    element.each(function(){
                        var $choices = element.children('option').eq(i).val();
                        console.log($choices);
                        i++;
                    });

                }
                else {
                    $(this).append('<input></input>');
                }

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
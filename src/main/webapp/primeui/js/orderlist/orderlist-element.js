if(!xtag.tags['p-orderlist']) {
 
    xtag.register('p-orderlist', {
    
        accessors: {
            name: {
                attribute: {}
            },
            controlslocation: {
                attribute: {}
            },
            dragdrop: {
                attribute: {}
            },
            effect: {
                attribute: {}
            },
            caption: {
                attribute: {}
            },
            responsive: {
                attribute: {
                    boolean: true
                }
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this);
                element.children('option').wrapAll('<select></select>');
                
                this.xtag.select = element.children('select');
                if(this.name) {
                    this.xtag.select.attr('name', this.name);
                }
                
                this.xtag.select.puiorderlist({
                    controlsLocation: this.controlslocation||'none',
                    dragdrop: this.dragdrop ? JSON.parse(this.dragdrop) : true,
                    effect: this.effect||'fade',
                    caption: this.caption,
                    responsive: this.responsive
                });
            }
        },

        methods: {
            disable: function() {
                $(this).puiinputtext('disable');
            },
            enable: function() {
                $(this).puiinputtext('enable');
            }
        }
        
    });
    
}
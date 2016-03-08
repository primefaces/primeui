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
            },
            onreorder: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this,
                element = $(this),
                itemTemplate = element.children('template');
                element.children('option').wrapAll('<select></select>'),
                
                this.xtag.select = element.children('select');
                if(this.name) {
                    this.xtag.select.attr('name', this.name);
                }
                
                this.xtag.select.puiorderlist({
                    controlsLocation: this.controlslocation||'none',
                    dragdrop: this.dragdrop ? JSON.parse(this.dragdrop) : true,
                    effect: this.effect||'fade',
                    caption: this.caption,
                    responsive: this.responsive,
                    template: itemTemplate.length ? itemTemplate : null,
                    onreorder: this.onreorder ? function(event) {PUI.executeFunctionByName($this.onreorder, event);} : null
                });
            }
        }
        
    });
    
}
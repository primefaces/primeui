if(!xtag.tags['p-picklist']) {
 
    xtag.register('p-picklist', {

        accessors: {
            effect: {
                attribute: {}
            },
            effectspeed: {
                attribute: {}
            },
            sourcecaption: {
                attribute: {}
            },
            targetcaption: {
                attribute: {}
            },
            filter: {
                attribute: {
                    boolean: true
                }
            },
            filterfunction: {
                attribute: {}
            },
            filtermatchmode: {
                attribute: {}
            },
            dragdrop: {
                attribute: {}
            },
            ontransfer: {
                attribute: {}
            },
            showsourcecontrols: {
                attribute: {
                    boolean: true
                }
            },
            showtargetcontrols: {
                attribute: {
                    boolean: true
                }
            },
            responsive: {
                attribute: {
                    boolean: true
                }
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this),
                itemTemplate = element.children('template'),
                $this = this;
        
                element.children('select').wrapAll('<div></div>');
                this.xtag.container = element.children('div');
                
                $(this.xtag.container).puipicklist({
                    effect: this.effect||'fade',
                    effectSpeed: this.effectspeed||'fast',
                    sourceCaption: this.sourcecaption,
                    targetCaption: this.targetcaption,
                    showSourceControls: this.showsourcecontrols,
                    showTargetControls: this.showtargetcontrols,
                    filter: this.filter,
                    responsive: this.responsive,
                    filterFunction: this.filterfunction ? PUI.resolveObjectByName(this.filterfunction): null,
                    dragdrop: this.dragdrop ? JSON.parse(this.dragdrop) : true,
                    template: itemTemplate.length ? itemTemplate : null,
                    transfer: this.ontransfer ? function(event, param) {PUI.executeFunctionByName($this.ontransfer, param);} : null
                });
            }
        },

        methods: {
            
        }
        
    });
    
}
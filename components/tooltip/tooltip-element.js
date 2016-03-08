if(!xtag.tags['p-tooltip']) {
 
    xtag.register('p-tooltip', {
    
        accessors: {
            target: {
                attribute: {}
            },
            showevent: {
                attribute: {}
            },
            hideevent: {
                attribute: {}
            },
            showeffect: {
                attribute: {}
            },
            hideeffect: {
                attribute: {}
            },
            showeffectspeed: {
                attribute: {}
            },
            hideeffectspeed: {
                attribute: {}
            },
            my: {
                attribute: {}
            },
            at: {
                attribute: {}
            },
            showdelay: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var element = $(this),
                target = this.target ? $('#' + this.target) : $(document),
                contents = element.html(),
                children = $.trim(contents),
                options = {
                    showEvent: this.showevent||'mouseover',
                    hideEvent: this.hideevent||'mouseout',
                    showEffect: this.showeffect||'fade',
                    hideEffect: this.hideeffect,
                    showEffectSpeed: this.showeffectspeed||'normal',
                    hideEffectSpeed: this.hideeffectspeed||'normal',
                    my: this.my||'left top',
                    at: this.at||'right bottom',
                    showDelay: this.showdelay ? parseInt(this.showdelay): 150,
                    content: children.length ? children: null
                };
                                
                element.html('');
                
                target.puitooltip(options);
            }
        }
        
    });
    
}
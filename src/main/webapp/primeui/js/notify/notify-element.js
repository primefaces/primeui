if(!xtag.tags['p-notify']) {
 
    xtag.register('p-notify', {
    
        accessors: {
            position: {
                attribute: {}
            },
            visible: {
                attribute: {
                    boolean: true
                }
            },
            animate: {
                attribute : {}
            },
            effectspeed: {
                attribute: {}
            },
            easing: {
                attribute: {}
            },
            onbeforehide: {
                attribute: {}
            },
            onafterhide: {
                attribute: {}
            },
            onbeforeshow: {
                attribute: {}
            },
            onaftershow: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;
                this.xtag.container = $(this).append('<div></div>').children('div');
                
                $(this.xtag.container).puinotify({
                    position: this.position||'top',
                    visible: this.visible,
                    animate: this.animate ? JSON.parse(this.animate) : true,
                    effectspeed: this.effectspeed||'normal',
                    easing: this.easing||'swing',
                    beforeHide: this.onbeforehide ? function(event){PUI.executeFunctionByName($this.onbeforehide, event);} : null,
                    afterHide: this.onafterhide ? function(event){PUI.executeFunctionByName($this.onafterhide, event);} : null,
                    beforeShow: this.onbeforeshow ? function(event){PUI.executeFunctionByName($this.onbeforeshow, event);} : null,
                    afterShow: this.onaftershow ? function(event){PUI.executeFunctionByName($this.onaftershow, event);} : null,
                });
            }
        },

        methods: {
            show: function(content) {
                $(this.xtag.container).puinotify('show', content);
            },
            hide: function(content) {
                $(this.xtag.container).puinotify('show', content);
            },
            update: function(content) {
                $(this.xtag.container).puinotify('update', content);
            }
        }
        
    });
    
}
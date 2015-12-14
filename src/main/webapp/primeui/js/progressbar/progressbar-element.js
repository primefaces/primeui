if(!xtag.tags['p-progressbar']) {
 
    xtag.register('p-progressbar', {

        accessors: {
            value: {
                attribute:{}
            },
            labelTemplate: {
                attribute:{}
            },
            complete: {
                attribute:{}
            },
            easing: {
                attribute:{}
            },
            effectSpeed: {
                attribute:{}
            },
            showLabel: {
                attribute:{
                    boolean: true
                }
            }
        },

        lifecycle: {
            created: function() {
                console.log(this);
                this.xtag.progressbar = $('<div></div>').appendTo(this);

                $(this.xtag.progressbar).puiprogressbar({
                    value: this.value,
                    labelTemplate: this.labelTemplate,
                    complete: this.complete,
                    easing: this.easing,
                    effectSpeed: this.effectSpeed,
                    showLabel: this.showLabel
                });

                if(this.value) {
                    this.xtag.progressbar.attr('value', this.value);
                }

                if(this.complete) {
                    this.xtag.progressbar.attr('complete', this.complete);
                }

                if(this.showLabel) {
                    this.xtag.progressbar.prop('show', true);
                }
            }
        },

        methods: {
            disable: function() {
                $(this).puiprogressbar('disable');
            },
            enable: function() {
                $(this).puiprogressbar('enable');
            },
            enableARIA: function() {
                $(this).puiprogressbar();
            }
        }
        
    });
    
}
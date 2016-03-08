if(!xtag.tags['p-progressbar']) {
 
    xtag.register('p-progressbar', {

        accessors: {
            value: {
                attribute:{}
            },
            labeltemplate: {
                attribute:{}
            },
            oncomplete: {
                attribute:{}
            },
            easing: {
                attribute:{}
            },
            effectspeed: {
                attribute:{}
            },
            showlabel: {
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                this.xtag.progressbar = $(this).append('<div></div>').children('div');

                var $this = this;
                
                $(this.xtag.progressbar).puiprogressbar({
                    value: this.value||0,
                    labelTemplate: this.labeltemplate||'{value}%',
                    easing: this.easing||'easeInOutCirc',
                    effectSpeed: this.effectSpeed||'normal',
                    showLabel: this.showlabel ? JSON.parse(this.showlabel) : true,
                    complete: this.oncomplete ? function() {PUI.executeFunctionByName($this.oncomplete);} : null
                });
            }
        },

        methods: {
            getValue: function() {
                return $(this.xtag.progressbar).puiprogressbar('option', 'value');
            },
            setValue: function(val) {
                $(this.xtag.progressbar).puiprogressbar('option', 'value', val);
            }
        }
        
    });
    
}
if(!xtag.tags['p-slider']) {
 
    xtag.register('p-slider', {

        accessors: {
            animate: {
                attribute:{
                    boolean:true
                }
            },
            max: {
                attribute:{}
            },
            min: {
                attribute:{}
            },
            orientation:{
                attribute:{}
            },
            range: {
                attribute:{
                    boolean:true
                }
            },
            step: {
                attribute:{}
            },
            value: {
                attribute:{}
            },
            onchange: {
                attribute:{}
            },
            onslide: {
                attribute:{}
            },
            onstart: {
                attribute:{}
            },
            onstop: {
                attribute:{}
            },
            style: {
                attribute:{}
            },
            styleclass: {
                attribute:{}
            }
        },

        lifecycle: {

            created: function() {
                var $this = this;
                this.xtag.container = $(this).append('<div></div>').children('div');
                if(this.style)
                    this.xtag.container.attr('style', this.style);

                if(this.styleclass)
                    this.xtag.container.attr('class', this.styleclass);

                var rangeValues;
                if(this.range && this.value) {
                    rangeValues = [];
                    var values = this.value.split(',');
                    for (var i = 0; i <= 1; i++) {
                        rangeValues[i] = parseInt(values[i]);
                    }
                }

                this.xtag.container.slider({
                    animate: this.animate,
                    max: this.max ? parseInt(this.max) : 100,
                    min: this.min ? parseInt(this.min) : 0,
                    orientation: this.orientation || 'horizontal',
                    range: this.range ? true : false,
                    step: this.step ? parseInt(this.step) : 1,
                    value: this.value ? parseInt(this.value) : 0,
                    values: rangeValues,
                    change: this.onchange ? function(event, value){PUI.executeFunctionByName($this.onchange, event, value);} : null,
                    slide: this.onslide ? function(event, value){PUI.executeFunctionByName($this.onslide, event, value);} : null,
                    start: this.onstart ? function(event, value){PUI.executeFunctionByName($this.onstart, event, value);} : null,
                    stop: this.onstop ? function(event, value){PUI.executeFunctionByName($this.onstop, event, value);} : null
                });
            }
        },

        methods: {
            disable: function() {
                this.xtag.container.slider('disable');
            },
            enable: function() {
                this.xtag.container.slider('enable');
            },
            destroy: function() {
                this.xtag.container.slider('destroy');
            },
            getValue: function() {
                if(this.range)
                    return this.xtag.container.slider('values');
                else
                    return this.xtag.container.slider('value');
            },
            setValue: function(val) {
                if(this.range)
                    this.xtag.container.slider('values', val);
                else
                    this.xtag.container.slider('value', val);
            }
        }
        
    });
    
}
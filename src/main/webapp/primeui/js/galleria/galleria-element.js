if(!xtag.tags['p-galleria']) {

    xtag.register('p-galleria', {

        accessors: {
            panelwidth: {
                attribute:{}
            },
            panelHeight: {
                attribute: {}
            },
            framewidth: {
                attribute: {}
            },
            frameheight: {
                attribute: {}
            },
            activeindex: {
                attribute: {}
            },
            showfilmstrip: {
                attribute: {}
            },
            autoplay: {
                attribute: {}
            },
            transitioninterval: {
                attribute: {}
            },
            effect: {
                attribute: {}
            },
            showcaption: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                $(this).children('ul').wrap('<div></div>');
                this.xtag.container = this.children[0];

                $(this.xtag.container).puigalleria({
                    panelWidth: this.panelwidth ? parseInt(this.panelwidth) : 600,
                    panelHeight: this.panelheight ? parseInt(this.panelheight) : 400,
                    frameWidth: this.framewidth ? parseInt(this.framewidth) : 60,
                    frameHeight: this.frameHeight ? parseInt(this.frameheight) : 40,
                    activeIndex: this.activeindex ? parseInt(this.activeindex) : 0,
                    showFilmstring: this.showfilmstrip !== null ? JSON.parse(this.showfilmstrip) : true,
                    autoPlay: this.autoplay !== null ? JSON.parse(this.autoplay) : true,
                    transitionInterval: this.transitioninterval ? parseInt(this.transitioninterval) : 4000,
                    effect: this.effect,
                    effectSpeed: this.effectspeed ? parseInt(this.effectspeed) : 250,
                    showCaption: this.showcaption !== null ? JSON.parse(this.showcaption) : true
                });
            }
        },

        methods: {
            next: function() {
                $(this.xtag.container).puigalleria('next');
            },

            prev: function() {
                $(this.xtag.container).puigalleria('prev');
            }
        }
        
    });

}
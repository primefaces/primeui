if(!xtag.tags['p-lightbox']) {
 
    xtag.register('p-lightbox', {
    
        accessors: {
            iframewidth: {
                attribute:{}
            },
            iframeheight: {
                attribute:{}
            },
            iframe: {
                attribute:{
                    boolean: true
                }
            }
        },

        lifecycle: {
            created: function() {
                if(this.iframe)
                    this.xtag.container = $(this).children('a');
                else 
                    this.xtag.container = $(this).wrapInner('<div></div>').children('div');

                $(this.xtag.container).puilightbox({
                    iframeWidth: this.iframewidth ? parseInt(this.iframewidth) : 640,
                    iframeHeight: this.iframeheight ? parseInt(this.iframeheight) : 480,
                    iframe: this.iframe
                });
            }
        },

        methods: {
            disable: function() {
                $(this.xtag.lightbox).puilightbox('disabled');
            },
            enable: function() {
               $(this.xtag.lightbox).puilightbox('enable');
            },
            show: function() {
                $(this.xtag.lightbox).puilightbox('show');
            },
            hide: function() {
               $(this.xtag.lightbox).puilightbox('hide');
            },
            center: function() {
               $(this.xtag.lightbox).puilightbox('center');
            },
            isHidden: function() {
               $(this.xtag.lightbox).puilightbox('isHidden');
            },
            showURL: function() {
               $(this.xtag.lightbox).puilightbox('showURL');
            }
        }
        
    });
    
}
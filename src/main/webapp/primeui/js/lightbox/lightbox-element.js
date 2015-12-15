if(!xtag.tags['p-lightbox']) {
 
    xtag.register('p-lightbox', {
    
        accessors: {
            iframeWidth: {
                attribute:{}
            },
            iframeHeight: {
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
                if(!this.iframe)
                    this.xtag.lightbox = $(this).wrapInner('<div></div>').children('div');
               // else 
                   // this.xtag.lightbox = $(this).prepend('<div></div>');

                $(this.xtag.lightbox).puilightbox({
                    iframeWidth: this.iframeWidth || 640,
                    iframeHeight: this.iframeHeight || 480,
                    iframe: this.iframe || false
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
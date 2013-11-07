/**
 * PrimeUI Lightbox Widget
 */
$(function() {

    $.widget("primeui.puilightbox", {
       
        options: {
            iframeWidth: 640,
            iframeHeight: 480,
            iframe: false
        },
        
        _create: function() { 
            this.options.mode = this.options.iframe ? 'iframe' : (this.element.children('div').length == 1) ? 'inline' : 'image';
            
            var dom = '<div class="pui-lightbox ui-widget ui-helper-hidden ui-corner-all pui-shadow">';
            dom += '<div class="pui-lightbox-content-wrapper">';
            dom += '<a class="ui-state-default pui-lightbox-nav-left ui-corner-right ui-helper-hidden"><span class="ui-icon ui-icon-carat-1-w">go</span></a>';
            dom += '<div class="pui-lightbox-content ui-corner-all"></div>';
            dom += '<a class="ui-state-default pui-lightbox-nav-right ui-corner-left ui-helper-hidden"><span class="ui-icon ui-icon-carat-1-e">go</span></a>';
            dom += '</div>';
            dom += '<div class="pui-lightbox-caption ui-widget-header"><span class="pui-lightbox-caption-text"></span>';
            dom += '<a class="pui-lightbox-close ui-corner-all" href="#"><span class="ui-icon ui-icon-closethick"></span></a><div style="clear:both" /></div>';
            dom += '</div>';

            this.panel = $(dom).appendTo(document.body);
            this.contentWrapper = this.panel.children('.pui-lightbox-content-wrapper');
            this.content = this.contentWrapper.children('.pui-lightbox-content');
            this.caption = this.panel.children('.pui-lightbox-caption');
            this.captionText = this.caption.children('.pui-lightbox-caption-text');        
            this.closeIcon = this.caption.children('.pui-lightbox-close');
            
            if(this.options.mode === 'image') {
                this._setupImaging();
            } 
            else if(this.options.mode === 'inline') {
                this._setupInline();
            } 
            else if(this.options.mode === 'iframe') {
                this._setupIframe();
            }
            
            this._bindCommonEvents();
            
            this.links.data('puilightbox-trigger', true).find('*').data('puilightbox-trigger', true);
            this.closeIcon.data('puilightbox-trigger', true).find('*').data('puilightbox-trigger', true);
        },
        
        _bindCommonEvents: function() {
            var $this = this;

            this.closeIcon.hover(function() {
                $(this).toggleClass('ui-state-hover');
            }).click(function(e) {
                $this.hide();
                e.preventDefault();
            });

            //hide when outside is clicked
            $(document.body).bind('click.pui-lightbox', function (e) {            
                if($this.isHidden()) {
                    return;
                }

                //do nothing if target is the link
                var target = $(e.target);
                if(target.data('puilightbox-trigger')) {
                    return;
                }

                //hide if mouse is outside of lightbox
                var offset = $this.panel.offset();
                if(e.pageX < offset.left ||
                    e.pageX > offset.left + $this.panel.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.panel.height()) {

                    $this.hide();
                }
            });

            //sync window resize
            $(window).resize(function() {
                if(!$this.isHidden()) {
                    $(document.body).children('.ui-widget-overlay').css({
                        'width': $(document).width(),
                        'height': $(document).height()
                    });
                }
            });
        },
                
        _setupImaging: function() {
            var $this = this;

            this.links = this.element.children('a');
            this.content.append('<img class="ui-helper-hidden"></img>');
            this.imageDisplay = this.content.children('img');
            this.navigators = this.contentWrapper.children('a');

            this.imageDisplay.load(function() { 
                var image = $(this);

                $this._scaleImage(image);

                //coordinates to center overlay
                var leftOffset = ($this.panel.width() - image.width()) / 2,
                topOffset = ($this.panel.height() - image.height()) / 2;

                //resize content for new image
                $this.content.removeClass('pui-lightbox-loading').animate({
                    width: image.width(),
                    height: image.height()
                },
                500,
                function() {            
                    //show image
                    image.fadeIn();
                    $this._showNavigators();
                    $this.caption.slideDown();
                });

                $this.panel.animate({
                    left: '+=' + leftOffset,
                    top: '+=' + topOffset
                }, 500);
            });

            this.navigators.hover(function() {
                $(this).toggleClass('ui-state-hover'); 
            })
            .click(function(e) {
                var nav = $(this),
                    index;

                $this._hideNavigators();

                if(nav.hasClass('pui-lightbox-nav-left')) {
                    index = $this.current === 0 ? $this.links.length - 1 : $this.current - 1;

                    $this.links.eq(index).trigger('click');
                } 
                else {
                    index = $this.current == $this.links.length - 1 ? 0 : $this.current + 1;

                    $this.links.eq(index).trigger('click');
                }

                e.preventDefault(); 
            });

            this.links.click(function(e) {
                var link = $(this);

                if($this.isHidden()) {
                    $this.content.addClass('pui-lightbox-loading').width(32).height(32);
                    $this.show();
                }
                else {
                    $this.imageDisplay.fadeOut(function() {
                        //clear for onload scaling
                        $(this).css({
                            'width': 'auto',
                            'height': 'auto'
                        });

                        $this.content.addClass('pui-lightbox-loading');
                    });

                    $this.caption.slideUp();
                }

                window.setTimeout(function() {
                    $this.imageDisplay.attr('src', link.attr('href'));
                    $this.current = link.index();

                    var title = link.attr('title');
                    if(title) {
                        $this.captionText.html(title);
                    }
                }, 1000);


                e.preventDefault();
            });
        },

        _scaleImage: function(image) {
            var win = $(window),
            winWidth = win.width(),
            winHeight = win.height(),
            imageWidth = image.width(),
            imageHeight = image.height(),
            ratio = imageHeight / imageWidth;

            if(imageWidth >= winWidth && ratio <= 1){
                imageWidth = winWidth * 0.75;
                imageHeight = imageWidth * ratio;
            } 
            else if(imageHeight >= winHeight){
                imageHeight = winHeight * 0.75;
                imageWidth = imageHeight / ratio;
            }

            image.css({
                'width':imageWidth + 'px',
                'height':imageHeight + 'px'
            });
        },
        
        _setupInline: function() {
            this.links = this.element.children('a');
            this.inline = this.element.children('div').addClass('pui-lightbox-inline');
            this.inline.appendTo(this.content).show();
            var $this = this;

            this.links.click(function(e) {
                $this.show();

                var title = $(this).attr('title');
                if(title) {
                    $this.captionText.html(title);
                    $this.caption.slideDown();
                }

                e.preventDefault();
            });
        },

        _setupIframe: function() {
            var $this = this;
            this.links = this.element;
            this.iframe = $('<iframe frameborder="0" style="width:' + this.options.iframeWidth + 'px;height:' +
                            this.options.iframeHeight + 'px;border:0 none; display: block;"></iframe>').appendTo(this.content);

            if(this.options.iframeTitle) {
                this.iframe.attr('title', this.options.iframeTitle);
            }

            this.element.click(function(e) {
                if(!$this.iframeLoaded) {
                    $this.content.addClass('pui-lightbox-loading').css({
                        width: $this.options.iframeWidth,
                        height: $this.options.iframeHeight
                    });
                    
                    $this.show();

                    $this.iframe.on('load', function() {
                                    $this.iframeLoaded = true;
                                    $this.content.removeClass('pui-lightbox-loading');
                                })
                                .attr('src', $this.element.attr('href'));
                }
                else {
                    $this.show();
                }

                var title = $this.element.attr('title');
                if(title) {
                    $this.caption.html(title);
                    $this.caption.slideDown();
                }

                e.preventDefault();
            });
        },

        show: function() {
            this.center();

            this.panel.css('z-index', ++PUI.zindex).show();

            if(!this.modality) {
                this._enableModality();
            }

            this._trigger('show');
        },

        hide: function() {
            this.panel.fadeOut();
            this._disableModality();
            this.caption.hide();

            if(this.options.mode === 'image') {
                this.imageDisplay.hide().attr('src', '').removeAttr('style');
                this._hideNavigators();
            }

            this._trigger('hide');
        },

        center: function() { 
            var win = $(window),
            left = (win.width() / 2 ) - (this.panel.width() / 2),
            top = (win.height() / 2 ) - (this.panel.height() / 2);

            this.panel.css({
                'left': left,
                'top': top
            });
        },

        _enableModality: function() {
            this.modality = $('<div class="ui-widget-overlay"></div>')
                            .css({
                                'width': $(document).width(),
                                'height': $(document).height(),
                                'z-index': this.panel.css('z-index') - 1
                            })
                            .appendTo(document.body);
        },

        _disableModality: function() {
            this.modality.remove();
            this.modality = null;
        },

        _showNavigators: function() {
            this.navigators.zIndex(this.imageDisplay.zIndex() + 1).show();
        },

        _hideNavigators: function() {
            this.navigators.hide();
        },
        
        isHidden: function() {
            return this.panel.is(':hidden');
        },

        showURL: function(opt) {
            if(opt.width) {
                this.iframe.attr('width', opt.width);
            }
            if(opt.height) {
                this.iframe.attr('height', opt.height);
            }

            this.iframe.attr('src', opt.src); 

            this.show();
        }
    });
});
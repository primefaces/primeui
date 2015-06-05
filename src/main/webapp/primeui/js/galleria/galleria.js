/**
 * PrimeUI Lightbox Widget
 */
$(function() {

    $.widget("primeui.puigalleria", {
       
        options: {
            panelWidth: 600,
            panelHeight: 400,
            frameWidth: 60,
            frameHeight: 40,
            activeIndex: 0,
            showFilmstrip: true,
            autoPlay: true,
            transitionInterval: 4000,
            effect: 'fade',
            effectSpeed: 250,
            effectOptions: {},
            showCaption: true,
            customContent: false
        },
        
        _create: function() {
            this.element.addClass('pui-galleria ui-widget ui-widget-content ui-corner-all');
            this.panelWrapper = this.element.children('ul');
            this.panelWrapper.addClass('pui-galleria-panel-wrapper');
            this.panels = this.panelWrapper.children('li');
            this.panels.addClass('pui-galleria-panel ui-helper-hidden');
                        
            this.element.width(this.options.panelWidth);
            this.panelWrapper.width(this.options.panelWidth).height(this.options.panelHeight);
            this.panels.width(this.options.panelWidth).height(this.options.panelHeight);

            if(this.options.showFilmstrip) {
                this._renderStrip();
                this._bindEvents();
            }
            
            if(this.options.customContent) {
                this.panels.children('img').remove();
                this.panels.children('div').addClass('pui-galleria-panel-content');
            }
            
            //show first
            var activePanel = this.panels.eq(this.options.activeIndex);
            activePanel.removeClass('ui-helper-hidden');
            if(this.options.showCaption) {
                this._showCaption(activePanel);
            }
            
            this.element.css('visibility', 'visible');

            if(this.options.autoPlay) {
                this.startSlideshow();
            }
        },
        
        _renderStrip: function() {
            var frameStyle = 'style="width:' + this.options.frameWidth + "px;height:" + this.options.frameHeight + 'px;"';

            this.stripWrapper = $('<div class="pui-galleria-filmstrip-wrapper"></div>')
                    .width(this.element.width() - 50)
                    .height(this.options.frameHeight)
                    .appendTo(this.element);

            this.strip = $('<ul class="pui-galleria-filmstrip"></div>').appendTo(this.stripWrapper);

            for(var i = 0; i < this.panels.length; i++) {
                var image = this.panels.eq(i).children('img'),
                frameClass = (i == this.options.activeIndex) ? 'pui-galleria-frame pui-galleria-frame-active' : 'pui-galleria-frame',
                frameMarkup = '<li class="'+ frameClass + '" ' + frameStyle + '>' +
                '<div class="pui-galleria-frame-content" ' + frameStyle + '>' +
                '<img src="' + image.attr('src') + '" class="pui-galleria-frame-image" ' + frameStyle + '/>' +
                '</div></li>';

                this.strip.append(frameMarkup);
            }

            this.frames = this.strip.children('li.pui-galleria-frame');

            //navigators
            this.element.append('<div class="pui-galleria-nav-prev fa fa-fw fa-chevron-circle-left" style="bottom:' + (this.options.frameHeight / 2) + 'px"></div>' + 
                '<div class="pui-galleria-nav-next fa fa-fw fa-chevron-circle-right" style="bottom:' + (this.options.frameHeight / 2) + 'px"></div>');

            //caption
            if(this.options.showCaption) {
                this.caption = $('<div class="pui-galleria-caption"></div>').css({
                    'bottom': this.stripWrapper.outerHeight() + 10,
                    'width': this.panelWrapper.width()
                    }).appendTo(this.element);
            }
        },
        
        _bindEvents: function() {
            var $this = this;

            this.element.children('div.pui-galleria-nav-prev').on('click.puigalleria', function() {
                if($this.slideshowActive) {
                    $this.stopSlideshow();
                }

                if(!$this.isAnimating()) {
                    $this.prev();
                }
            });

            this.element.children('div.pui-galleria-nav-next').on('click.puigalleria', function() {
                if($this.slideshowActive) {
                    $this.stopSlideshow();
                }

                if(!$this.isAnimating()) {
                    $this.next();
                }
            });

            this.strip.children('li.pui-galleria-frame').on('click.puigalleria', function() {
                if($this.slideshowActive) {
                    $this.stopSlideshow();
                }

                $this.select($(this).index(), false);
            });
        },

        startSlideshow: function() {
            var $this = this;

            this.interval = window.setInterval(function() {
                $this.next();
            }, this.options.transitionInterval);

            this.slideshowActive = true;
        },

        stopSlideshow: function() {
            window.clearInterval(this.interval);

            this.slideshowActive = false;
        },

        isSlideshowActive: function() {
            return this.slideshowActive;
        },

        select: function(index, reposition) {
            if(index !== this.options.activeIndex) {
                if(this.options.showCaption) {
                    this._hideCaption();
                }

                var oldPanel = this.panels.eq(this.options.activeIndex),
                newPanel = this.panels.eq(index);

                //content
                oldPanel.hide(this.options.effect, this.options.effectOptions, this.options.effectSpeed);
                newPanel.show(this.options.effect, this.options.effectOptions, this.options.effectSpeed);

                if (this.options.showFilmstrip) {
                    var oldFrame = this.frames.eq(this.options.activeIndex),
                        newFrame = this.frames.eq(index);

                    //frame
                    oldFrame.removeClass('pui-galleria-frame-active').css('opacity', '');
                    newFrame.animate({opacity:1.0}, this.options.effectSpeed, null, function() {
                       $(this).addClass('pui-galleria-frame-active');
                    });

                    //viewport
                    if( (reposition === undefined || reposition === true) ) {
                        var frameLeft = newFrame.position().left,
                            stepFactor = this.options.frameWidth + parseInt(newFrame.css('margin-right'), 10),
                            stripLeft = this.strip.position().left,
                            frameViewportLeft = frameLeft + stripLeft,
                            frameViewportRight = frameViewportLeft + this.options.frameWidth;

                        if(frameViewportRight > this.stripWrapper.width()) {
                            this.strip.animate({left: '-=' + stepFactor}, this.options.effectSpeed, 'easeInOutCirc');
                        } else if(frameViewportLeft < 0) {
                            this.strip.animate({left: '+=' + stepFactor}, this.options.effectSpeed, 'easeInOutCirc');
                        }
                    }
                }

                //caption
                if(this.options.showCaption) {
                    this._showCaption(newPanel);
                }

                this.options.activeIndex = index;
            }
        },
        
        _hideCaption: function() {
            this.caption.slideUp(this.options.effectSpeed);
        },
        
        _showCaption: function(panel) {
            var image = panel.children('img');
            this.caption.html('<h4>' + image.attr('title') + '</h4><p>' + image.attr('alt') + '</p>').slideDown(this.options.effectSpeed);
        },

        prev: function() {
            if(this.options.activeIndex !== 0) {
                this.select(this.options.activeIndex - 1);
            }
        },

        next: function() {
            if(this.options.activeIndex !== (this.panels.length - 1)) {
                this.select(this.options.activeIndex + 1);
            } 
            else {
                this.select(0, false);
                this.strip.animate({left: 0}, this.options.effectSpeed, 'easeInOutCirc');
            }
        },

        isAnimating: function() {
            return this.strip.is(':animated');
        }
    });
});
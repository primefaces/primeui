/**
 * PrimeFaces OverlayPanel Widget
 */
(function() {

    $.widget("primeui.puioverlaypanel", {
       
        options: {
            target: null,
            showEvent: 'click',
            hideEvent: 'click',
            showCloseIcon: false,
            dismissable: false,
            my: 'left top',
            at: 'left bottom',
            onShow: null,
            onHide: null
        },
        
        _create: function() {
            this.element.addClass('ui-overlaypanel ui-widget ui-widget-content ui-corner-all ui-shadow ui-helper-hidden');
            this.container = $('<div class="ui-overlaypanel-content"></div>').appendTo(this.element);
            this.container.append(this.element.contents());
            
            if(this.options.showCloseIcon) {
                this.closerIcon = $('<a href="#" class="ui-overlaypanel-close ui-state-default" href="#"><span class="fa fa-close"></span></a>').appendTo(this.container);
            }
            
            this._bindCommonEvents();
            
            if(this.options.target) {
                this.target = $(this.options.target);
                this._bindTargetEvents();
            }
        },
        
        _bindCommonEvents: function() {
            var $this = this;
            
            if(this.options.showCloseIcon) {
                this.closerIcon.on('mouseover.puioverlaypanel', function() {
                    $(this).addClass('ui-state-hover');
                })
                .on('mouseout.puioverlaypanel', function() {
                    $(this).removeClass('ui-state-hover');
                })
                .on('click.puioverlaypanel', function(e) {
                    if($this._isVisible() ) {
                        $this.hide();
                    }
                    else {
                        $this.show();
                    }
                    e.preventDefault();
                });
            }
            
            //hide overlay when mousedown is at outside of overlay
            if(this.options.dismissable) {
                var hideNS = 'mousedown.' + this.id;
                $(document.body).off(hideNS).on(hideNS, function (e) {
                    if(!$this._isVisible()) {
                        return;
                    }

                    //do nothing on target mousedown
                    if($this.target) {
                        var target = $(e.target);
                        if($this.target.is(target)||$this.target.has(target).length > 0) {
                            return;
                        }
                    }

                    //hide overlay if mousedown is on outside
                    var offset = $this.element.offset();
                    if(e.pageX < offset.left ||
                        e.pageX > offset.left + $this.element.outerWidth() ||
                        e.pageY < offset.top ||
                        e.pageY > offset.top + $this.element.outerHeight()) {

                        $this.hide();
                    }
                }); 
            }

            //Hide overlay on resize
            var resizeNS = 'resize.' + this.id;
            $(window).off(resizeNS).on(resizeNS, function() {
                if($this._isVisible()) {
                    $this._align();
                }
            });
        },
        
        _bindTargetEvents: function() {
            var $this = this;

            //show and hide events for target
            if(this.options.showEvent === this.options.hideEvent) {
                var event = this.options.showEvent;
                
                this.target.on(event, function(e) {
                    $this._toggle();
                });
            }
            else {
                var showEvent = this.options.showEvent + '.puioverlaypanel',
                hideEvent = this.options.hideEvent + '.puioverlaypanel';
                
                this.target.off(showEvent + '.puioverlaypanel' + ' ' + hideEvent + '.puioverlaypanel').on(showEvent, function(e) {
                    if(!$this._isVisible()) {
                        $this.show();
                        if(showEvent === 'contextmenu.puioverlaypanel') {
                            e.preventDefault();
                        }
                    }
                })
                .on(hideEvent, function(e) {
                    if($this._isVisible()) {
                        $this.hide();
                    }
                });
            }
            
            $this.target.off('keydown.puioverlaypanel keyup.puioverlaypanel').on('keydown.puioverlaypanel', function(e) {
                var keyCode = $.ui.keyCode, key = e.which;
                
                if(key === keyCode.ENTER||key === keyCode.NUMPAD_ENTER) {
                    e.preventDefault();
                }
            })
            .on('keyup.puioverlaypanel', function(e) {
                var keyCode = $.ui.keyCode, key = e.which;
                
                if(key === keyCode.ENTER||key === keyCode.NUMPAD_ENTER) {
                    $this._toggle();
                    e.preventDefault();
                }
            });
        },
        
        _toggle: function() {
            if(this.target.length > 1) {
                this.show();
            }
            else {
                if(this._isVisible() ) {
                    this.hide();
                }
                else {
                    this.show();
                }
            }    
        },
        
        _isVisible: function() {
            return this.element.css('visibility') == 'visible' && this.element.is(':visible');
        },
        
        show: function(target) {
            var $this = this;
            
            this._align(target);

            //replace visibility hidden with display none for effect support, toggle marker class
            this.element.css({
                'display':'none',
                'visibility':'visible'
            });

            if(this.options.showEffect) {
                this.element.show(this.options.showEffect, {}, 200, function() {
                    $this.postShow();
                });
            }
            else {
                this.element.show();
                this.postShow();
            }
        },
        
        hide: function() {
            var $this = this;
            
            if(this.options.hideEffect) {
                this.element.hide(this.options.hideEffect, {}, 200, function() {
                    $this.postHide();
                });
            }
            else {
                this.element.hide();
                this.postHide();
            }
        },
        
        postShow: function() {
            if(this.options.onShow) {
                this.options.onShow.call(this);
            }
            
            this._applyFocus();
        },
        
        postHide: function() {
            //replace display block with visibility hidden for hidden container support, toggle marker class
            this.element.css({
                'display':'block',
                'visibility':'hidden'
            });
            
            if(this.options.onHide) {
                this.options.onHide.call(this);
            }
        },
        
        _align: function(target) {
            var fixedPosition = this.element.css('position') == 'fixed',
            win = $(window),
            positionOffset = fixedPosition ? '-' + win.scrollLeft() + ' -' + win.scrollTop() : null,
            targetId = target||this.options.target;

            this.element.css({'left':'', 'top':'', 'z-index': PUI.zindex})
                    .position({
                        my: this.options.my,
                        at: this.options.at,
                        of: document.getElementById(this.options.target),
                        offset: positionOffset
                    });
        },
        
        _applyFocus: function() {
            this.element.find(':not(:submit):not(:button):input:visible:enabled:first').focus();
        }
        
    });
})();
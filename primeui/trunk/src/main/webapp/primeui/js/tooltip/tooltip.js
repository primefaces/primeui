/**
 * PrimeFaces Tooltip Widget
 */
$(function() {

    $.widget("primeui.puitooltip", {
       
        options: {
            showEvent: 'mouseover',
            hideEvent: 'mouseout',
            showEffect: 'fade',
            hideEffect: null,
            showEffectSpeed: 'normal',
            hideEffectSpeed: 'normal',
            my: 'left top',
            at: 'right bottom',
            showDelay: 150
        },
        
        _create: function() {
            this.options.showEvent = this.options.showEvent + '.puitooltip';
            this.options.hideEvent = this.options.hideEvent + '.puitooltip';
            
            if(this.element.get(0) === document) {
                this._bindGlobal();
            }
            else {
                this._bindTarget();
            }
        },
        
        _bindGlobal: function() {
            this.container = $('<div class="pui-tooltip pui-tooltip-global ui-widget ui-widget-content ui-corner-all pui-shadow" />').appendTo(document.body);
            this.globalSelector = 'a,:input,:button,img';
            var $this = this;

            $(document).off(this.options.showEvent + ' ' + this.options.hideEvent, this.globalSelector)
                        .on(this.options.showEvent, this.globalSelector, null, function() {
                            var target = $(this),
                            title = target.attr('title');

                            if(title) {
                                $this.container.text(title);
                                $this.globalTitle = title;
                                $this.target = target;
                                target.attr('title', '');
                                $this.show();
                            }
                        })
                        .on(this.options.hideEvent, this.globalSelector, null, function() {
                            var target = $(this);

                            if($this.globalTitle) {
                                $this.container.hide();
                                target.attr('title', $this.globalTitle);
                                $this.globalTitle = null;
                                $this.target = null;
                            }
                        });

            var resizeNS = 'resize.puitooltip';
            $(window).unbind(resizeNS).bind(resizeNS, function() {
                if($this.container.is(':visible')) {
                    $this._align();
                }
            });
        },
        
        _bindTarget: function() {
            this.container = $('<div class="pui-tooltip ui-widget ui-widget-content ui-corner-all pui-shadow" />').appendTo(document.body);

            var $this = this;
            this.element.off(this.options.showEvent + ' ' + this.options.hideEvent)
                        .on(this.options.showEvent, function() {
                            $this.show();
                        })
                        .on(this.options.hideEvent, function() {
                            $this.hide();
                        });

            this.container.html(this.options.content);

            this.element.removeAttr('title');
            this.target = this.element;

            var resizeNS = 'resize.' + this.element.attr('id');
            $(window).unbind(resizeNS).bind(resizeNS, function() {
                if($this.container.is(':visible')) {
                    $this._align();
                }
            });
        },
        
        _align: function() {
            this.container.css({
                left:'', 
                top:'',
                'z-index': ++PUI.zindex
            })
            .position({
                my: this.options.my,
                at: this.options.at,
                of: this.target
            });
        },

        show: function() {
            var $this = this;

            this.timeout = window.setTimeout(function() {
                $this._align();
                $this.container.show($this.options.showEffect, {}, $this.options.showEffectSpeed);
            }, this.options.showDelay);
        },

        hide: function() {
            window.clearTimeout(this.timeout);

            this.container.hide(this.options.hideEffect, {}, this.options.hideEffectSpeed, function() {
                $(this).css('z-index', '');
            });
        }
    });
});
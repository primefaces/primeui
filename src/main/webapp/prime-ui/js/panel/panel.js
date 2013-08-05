/**
 * PrimeUI Panel Widget
 */
$(function() {

    $.widget("prime-ui.puipanel", {
       
        options: {
            toggleable: false,
            toggleDuration: 'normal',
            toggleOrientation : 'vertical',
            collapsed: false,
            closable: false,
            closeDuration: 'normal'
        },
        
        _create: function() {
            this.element.addClass('pui-panel ui-widget ui-widget-content ui-corner-all')
                .contents().wrapAll('<div class="pui-panel-content ui-widget-content" />');
                
            var title = this.element.attr('title');
            if(title) {
                this.element.prepend('<div class="pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all"><span class="ui-panel-title">'
                        + title + "</span></div>")
                        .removeAttr('title');
            }
            
            this.header = this.element.children('div.pui-panel-titlebar');
            this.title = this.header.children('span.ui-panel-title');
            this.content = this.element.children('div.pui-panel-content');
            
            var $this = this;
            
            if(this.options.closable) {
                this.closer = $('<a class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#"><span class="ui-icon ui-icon-closethick"></span></a>')
                                .appendTo(this.header)
                                .on('click.puipanel', function(e) {
                                    $this.close();
                                    e.preventDefault();
                                });
            }
            
            if(this.options.toggleable) {
                var icon = this.options.collapsed ? 'ui-icon-plusthick' : 'ui-icon-minusthick';
                
                this.toggler = $('<a class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#"><span class="ui-icon ' + icon + '"></span></a>')
                                .appendTo(this.header)
                                .on('click.puipanel', function(e) {
                                    $this.toggle();
                                    e.preventDefault();
                                });
                                
                if(this.options.collapsed) {
                    this.content.hide();
                }
            }
            
            this._bindEvents();
        },

        _bindEvents: function() {
            this.header.find('a.pui-panel-titlebar-icon').on('hover.puipanel', function() {$(this).toggleClass('ui-state-hover');});
        },
        
        close: function() {
            var $this = this;
            
            this._trigger('beforeClose', null);
            
            this.element.fadeOut(this.options.closeDuration,
                function() {
                    $this._trigger('afterClose', null);
                }
            );
        },
        
        toggle: function() {
            if(this.options.collapsed) {
                this.expand();
            }
            else {
                this.collapse();
            }
        },
        
        expand: function() {
            this.toggler.children('span.ui-icon').removeClass('ui-icon-plusthick').addClass('ui-icon-minusthick');
            
            if(this.options.toggleOrientation === 'vertical') {
                this._slideDown();
            } 
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideRight();
            }
        },

        collapse: function() {
            this.toggler.children('span.ui-icon').removeClass('ui-icon-minusthick').addClass('ui-icon-plusthick');
            
            if(this.options.toggleOrientation === 'vertical') {
                this._slideUp();
            } 
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideLeft();
            }
        },
        
        _slideUp: function() {        
            var $this = this;
            
            this._trigger('beforeCollapse');
            
            this.content.slideUp(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterCollapse');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideDown: function() {  
            var $this = this;
            
            this._trigger('beforeExpand');
            
            this.content.slideDown(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterExpand');
                $this.options.collapsed = !$this.options.collapsed;
            }); 
        },

        _slideLeft: function() {
            var $this = this;

            this.originalWidth = this.element.width();

            this.title.hide();
            this.toggler.hide();
            this.content.hide();

            this.element.animate({
                width: '42px'
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.toggler.show();
                $this.element.addClass('pui-panel-collapsed-h');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideRight: function() {
            var $this = this,
            expandWidth = this.originalWidth||'100%';

            this.toggler.hide();

            this.element.animate({
                width: expandWidth
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.element.removeClass('pui-panel-collapsed-h');
                $this.title.show();
                $this.toggler.show();
                $this.options.collapsed = !$this.options.collapsed;

                $this.content.css({
                    'visibility': 'visible'
                    ,'display': 'block'
                    ,'height': 'auto'
                });
            });
        }
    });
});

/**
 * PrimeFaces Panel Widget
PrimeFaces.widget.Panel = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.header = this.jq.children('div.ui-panel-titlebar');
        this.title = this.header.children('span.ui-panel-title');
        this.content = $(this.jqId + '_content');
        
        this.onshowHandlers = [];
        
        if(this.cfg.toggleable) {
            this.bindToggler();
        }

        if(this.cfg.closable) {
            this.bindCloser();
        }
        
        //visuals for action items
        this.header.find('.ui-panel-titlebar-icon').on('hover.ui-panel', function() {$(this).toggleClass('ui-state-hover');});
    },
    
    toggle: function() {
        if(this.cfg.collapsed) {
            this.expand();
        }
        else {
            this.collapse();
        }
    },
    
    expand: function() {
        this.toggleState(false, 'ui-icon-plusthick', 'ui-icon-minusthick');
        
        if(this.cfg.toggleOrientation === 'vertical')
            this.slideDown();
        else if(this.cfg.toggleOrientation === 'horizontal')
            this.slideRight();    
    },
    
    collapse: function() {
        this.toggleState(true, 'ui-icon-minusthick', 'ui-icon-plusthick');
        
        if(this.cfg.toggleOrientation === 'vertical')
            this.slideUp();
        else if(this.cfg.toggleOrientation === 'horizontal')
            this.slideLeft();
    },
    
    slideUp: function() {        
        this.content.slideUp(this.cfg.toggleSpeed, 'easeInOutCirc');
    },
    
    slideDown: function() {        
        this.content.slideDown(this.cfg.toggleSpeed, 'easeInOutCirc');
    },
    
    slideLeft: function() {
        var _self = this;
        
        this.originalWidth = this.jq.width();
                
        this.title.hide();
        this.toggler.hide();
        this.content.hide();

        this.jq.animate({
            width: '42px'
        }, this.cfg.toggleSpeed, 'easeInOutCirc', function() {
            _self.toggler.show();
            _self.jq.addClass('ui-panel-collapsed-h');
        });
    },
    
    slideRight: function() {
        var _self = this,
        expandWidth = this.originalWidth||'100%';
        
        this.toggler.hide();
        
        this.jq.animate({
            width: expandWidth
        }, this.cfg.toggleSpeed, 'easeInOutCirc', function() {
            _self.jq.removeClass('ui-panel-collapsed-h');
            _self.title.show();
            _self.toggler.show();
        
            _self.content.css({
                'visibility': 'visible'
                ,'display': 'block'
                ,'height': 'auto'
            });
        });
    },
    
    toggleState: function(collapsed, removeIcon, addIcon) {
        v
        this.cfg.collapsed = collapsed;
        this.toggleStateHolder.val(collapsed);
        
        this.fireToggleEvent();
    },
    
    fireToggleEvent: function() {
        if(this.cfg.behaviors) {
            var toggleBehavior = this.cfg.behaviors['toggle'];
            
            if(toggleBehavior) {
                toggleBehavior.call(this);
            }
        }
    },
    
    close: function() {
        this.visibleStateHolder.val(false);

        var _self = this;

        $(this.jqId).fadeOut(this.cfg.closeSpeed,
            function(e) {
                if(_self.cfg.behaviors) {
                    var closeBehavior = _self.cfg.behaviors['close'];
                    if(closeBehavior) {
                        closeBehavior.call(_self, e);
                    }
                }
            }
        );
    },
    
    show: function() {
        var _self = this;
        $(this.jqId).fadeIn(this.cfg.closeSpeed, function() {
            _self.invokeOnshowHandlers();
        });

        this.visibleStateHolder.val(true);
    },
    
    bindToggler: function() {
        var _self = this;
        
        this.toggler = $(this.jqId + '_toggler');
        this.toggleStateHolder = $(this.jqId + '_collapsed');

        this.toggler.click(function() {_self.toggle();});
    },
    
    bindCloser: function() {
        var _self = this;
        
        this.closer = $(this.jqId + '_closer');
        this.visibleStateHolder = $(this.jqId + "_visible");

        this.closer.click(function() {_self.close();});
    },
        
    addOnshowHandler: function(fn) {
        this.onshowHandlers.push(fn);
    },
    
    invokeOnshowHandlers: function() {
        this.onshowHandlers = $.grep(this.onshowHandlers, function(fn) {
            return !fn.call();
        });
    }

});*/
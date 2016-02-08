/**
 * PrimeUI BaseMenu widget
 */
(function() {

    $.widget("primeui.puibasemenu", {
       
        options: {
             popup: false,
             trigger: null,
             my: 'left top',
             at: 'left bottom',
             triggerEvent: 'click'
        },
        
        _create: function() {
            if(this.options.popup) {
                this._initPopup();
            }
        },
                
        _initPopup: function() {
            var $this = this;

            this.element.closest('.ui-menu').addClass('ui-menu-dynamic ui-shadow').appendTo(document.body);

            if($.type(this.options.trigger) === 'string') {
                this.options.trigger =  $(this.options.trigger);
            }
            
            this.positionConfig = {
                my: this.options.my,
                at: this.options.at,
                of: this.options.trigger
            };
            
            this.options.trigger.on(this.options.triggerEvent + '.ui-menu', function(e) {
                if($this.element.is(':visible')) {
                    $this.hide();
                }
                else {
                    $this.show();
                }
                
                e.preventDefault();
            });

            //hide overlay on document click
            $(document.body).on('click.ui-menu', function (e) {
                var popup = $this.element.closest('.ui-menu');
                if(popup.is(":hidden")) {
                    return;
                }

                //do nothing if mousedown is on trigger
                var target = $(e.target);
                if(target.is($this.options.trigger.get(0))||$this.options.trigger.has(target).length > 0) {
                    return;
                }

                //hide if mouse is outside of overlay except trigger
                var offset = popup.offset();
                if(e.pageX < offset.left ||
                    e.pageX > offset.left + popup.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + popup.height()) {

                    $this.hide(e);
                }
            });

            //Hide overlay on resize
            $(window).on('resize.ui-menu', function() {
                if($this.element.closest('.ui-menu').is(':visible')) {
                    $this.align();
                }
            });
        },
                
        show: function() {
            this.align();
            this.element.closest('.ui-menu').css('z-index', ++PUI.zindex).show();
        },

        hide: function() {
            this.element.closest('.ui-menu').fadeOut('fast');
        },

        align: function() {
            this.element.closest('.ui-menu').css({left:'', top:''}).position(this.positionConfig);
        }
    });
})();

/**
 * PrimeUI Menu widget
 */
(function() {

    $.widget("primeui.puimenu", $.primeui.puibasemenu, {
       
        options: {
             
        },
        
        _create: function() {
            this.element.addClass('ui-menu-list ui-helper-reset').
                    wrap('<div class="ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix" />');
            
            this.element.children('li').each(function() {
                var listItem = $(this);
                
                if(listItem.children('h3').length > 0) {
                    listItem.addClass('ui-widget-header ui-corner-all');
                }
                else {
                    listItem.addClass('ui-menuitem ui-widget ui-corner-all');
                    var menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');
                    
                    menuitemLink.addClass('ui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');
                    
                    if(icon) {
                        menuitemLink.prepend('<span class="ui-menuitem-icon fa fa-fw ' + icon + '"></span>');
                    }
                }
            });
            
            this.menuitemLinks = this.element.find('.ui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();
            
            this._super();
        },
            
        _bindEvents: function() {  
            var $this = this;

            this.menuitemLinks.on('mouseenter.ui-menu', function(e) {
                $(this).addClass('ui-state-hover');
            })
            .on('mouseleave.ui-menu', function(e) {
                $(this).removeClass('ui-state-hover');
            });

            if(this.options.popup) {
                this.menuitemLinks.on('click.ui-menu', function() {
                    $this.hide();
                });  
            }   
        }
    });
})();

/**
 * PrimeUI BreadCrumb Widget
 */
(function() {

    $.widget("primeui.puibreadcrumb", {
        
        _create: function() {
            this.element.wrap('<div class="ui-breadcrumb ui-module ui-widget ui-widget-header ui-helper-clearfix ui-corner-all" role="menu">');
            
            this.element.children('li').each(function(index) {
                var listItem = $(this);
                
                listItem.attr('role', 'menuitem');
                var menuitemLink = listItem.children('a');
                menuitemLink.addClass('ui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');
                    
                if(index > 0) {
                    listItem.before('<li class="ui-breadcrumb-chevron fa fa-chevron-right"></li>');
                }
                else {
                    listItem.before('<li class="fa fa-home"></li>');
                }
            });
        }
    });
})();

/*
 * PrimeUI TieredMenu Widget
 */
(function() {

    $.widget("primeui.puitieredmenu", $.primeui.puibasemenu, {
        
        options: {
            autoDisplay: true    
        },
        
        _create: function() {
            this._render();
            
            this.links = this.element.find('.ui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();
            
            this._super();
        },
                
        _render: function() {
            var $this = this;
            this.element.addClass('ui-menu-list ui-helper-reset').
                    wrap('<div class="ui-tieredmenu ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix" />');
            
            this.element.parent().uniqueId();
            this.options.id = this.element.parent().attr('id');
          
            this.element.find('li').each(function() {
                    var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');
                    
                    menuitemLink.addClass('ui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');
                    
                    if(icon) {
                        menuitemLink.prepend('<span class="ui-menuitem-icon fa fa-fw ' + icon + '"></span>');
                    }
                    
                    listItem.addClass('ui-menuitem ui-widget ui-corner-all');
                    if(listItem.children('ul').length > 0) {
                        var submenuIcon = listItem.parent().hasClass('ui-menu-child') ? 'fa-caret-right' : $this._getRootSubmenuIcon();
                        listItem.addClass('ui-menu-parent');
                        listItem.children('ul').addClass('ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
                        
                        menuitemLink.prepend('<span class="ui-submenu-icon fa fa-fw ' + submenuIcon + '"></span>');
                    }            
            });
        },
                
        _bindEvents: function() {        
            this._bindItemEvents();
        
            this._bindDocumentHandler();
        },
    
        _bindItemEvents: function() {
            var $this = this;

            this.links.on('mouseenter.ui-menu',function() {
                var link = $(this),
                menuitem = link.parent(),
                autoDisplay = $this.options.autoDisplay;

                var activeSibling = menuitem.siblings('.ui-menuitem-active');
                if(activeSibling.length === 1) {
                    $this._deactivate(activeSibling);
                }

                if(autoDisplay||$this.active) {
                    if(menuitem.hasClass('ui-menuitem-active')) {
                        $this._reactivate(menuitem);
                    }
                    else {
                        $this._activate(menuitem);
                    }  
                }
                else {
                    $this._highlight(menuitem);
                }
            });

            if(this.options.autoDisplay === false) {
                this.rootLinks = this.element.find('> .ui-menuitem > .ui-menuitem-link');
                this.rootLinks.data('primeui-tieredmenu-rootlink', this.options.id).find('*').data('primeui-tieredmenu-rootlink', this.options.id);

                this.rootLinks.on('click.ui-menu', function(e) {
                    var link = $(this),
                    menuitem = link.parent(),
                    submenu = menuitem.children('ul.ui-menu-child');

                    if(submenu.length === 1) {
                        if(submenu.is(':visible')) {
                            $this.active = false;
                            $this._deactivate(menuitem);
                        }
                        else {                                        
                            $this.active = true;
                            $this._highlight(menuitem);
                            $this._showSubmenu(menuitem, submenu);
                        }
                    }
                });
            }
            
            this.element.parent().find('ul.ui-menu-list').on('mouseleave.ui-menu', function(e) {
                if($this.activeitem) {
                    $this._deactivate($this.activeitem);
                }
           
                e.stopPropagation();
            });
        },
       
        _bindDocumentHandler: function() {
            var $this = this;

            $(document.body).on('click.ui-menu', function(e) {
                var target = $(e.target);
                if(target.data('primeui-tieredmenu-rootlink') === $this.options.id) {
                    return;
                }
                    
                $this.active = false;

                $this.element.find('li.ui-menuitem-active').each(function() {
                    $this._deactivate($(this), true);
                });
            });
        },
    
        _deactivate: function(menuitem, animate) {
            this.activeitem = null;
            menuitem.children('a.ui-menuitem-link').removeClass('ui-state-hover');
            menuitem.removeClass('ui-menuitem-active');

            if(animate) {
                menuitem.children('ul.ui-menu-child:visible').fadeOut('fast');
            }
            else {
                menuitem.children('ul.ui-menu-child:visible').hide();
            }
        },

        _activate: function(menuitem) {
            this._highlight(menuitem);

            var submenu = menuitem.children('ul.ui-menu-child');
            if(submenu.length === 1) {
                this._showSubmenu(menuitem, submenu);
            }
        },

        _reactivate: function(menuitem) {
            this.activeitem = menuitem;
            var submenu = menuitem.children('ul.ui-menu-child'),
            activeChilditem = submenu.children('li.ui-menuitem-active:first'),
            _self = this;

            if(activeChilditem.length === 1) {
                _self._deactivate(activeChilditem);
            }
        },

        _highlight: function(menuitem) {
            this.activeitem = menuitem;
            menuitem.children('a.ui-menuitem-link').addClass('ui-state-hover');
            menuitem.addClass('ui-menuitem-active');
        },
                
        _showSubmenu: function(menuitem, submenu) {
            submenu.css({
                'left': menuitem.outerWidth(),
                'top': 0,
                'z-index': ++PUI.zindex
            });

            submenu.show();
        },
        
        _getRootSubmenuIcon: function() {
            return 'fa-caret-right';
        }
            
    });

})();

/**
 * PrimeUI Menubar Widget
 */
(function() {

    $.widget("primeui.puimenubar", $.primeui.puitieredmenu, {
        
        options: {
            autoDisplay: true    
        },
        
        _create: function() {
            this._super();
            this.element.parent().removeClass('ui-tieredmenu').
                    addClass('ui-menubar');
        },
              
        _showSubmenu: function(menuitem, submenu) {
            var win = $(window),
            submenuOffsetTop = null,
            submenuCSS = {
                'z-index': ++PUI.zindex
            };

            if(menuitem.parent().hasClass('ui-menu-child')) {
                submenuCSS.left = menuitem.outerWidth();
                submenuCSS.top = 0; 
                submenuOffsetTop = menuitem.offset().top - win.scrollTop();
            } 
            else {
                submenuCSS.left = 0;
                submenuCSS.top = menuitem.outerHeight(); 
                submenuOffsetTop = menuitem.offset().top + submenuCSS.top - win.scrollTop();
            }

            //adjust height within viewport
            submenu.css('height', 'auto');
            if((submenuOffsetTop + submenu.outerHeight()) > win.height()) {
                submenuCSS.overflow = 'auto';
                submenuCSS.height = win.height() - (submenuOffsetTop + 20);
            }

            submenu.css(submenuCSS).show();
        },
        
        _getRootSubmenuIcon: function() {
            return 'fa-caret-down';
        }
    });

})();

/*
 * PrimeUI SlideMenu Widget
 */
(function() {

    $.widget("primeui.puislidemenu", $.primeui.puibasemenu, {
                
        _create: function() {
            this._render();
        
            //elements
            this.rootList = this.element;
            this.content = this.element.parent();
            this.wrapper = this.content.parent();
            this.container = this.wrapper.parent();
            this.submenus = this.container.find('ul.ui-menu-list');
            
            this.links = this.element.find('a.ui-menuitem-link:not(.ui-state-disabled)');
            this.backward = this.wrapper.children('div.ui-slidemenu-backward');

            //config
            this.stack = [];
            this.jqWidth = this.container.width();

            if(!this.element.hasClass('ui-menu-dynamic')) {
                var $this = this;
                setTimeout(function() {
                    $this._applyDimensions();
                }, 100);
                
            }
            this._super();

            this._bindEvents();
        },
        
        _render: function() {
            this.element.addClass('ui-menu-list ui-helper-reset').
                    wrap('<div class="ui-menu ui-slidemenu ui-widget ui-widget-content ui-corner-all"/>').
                    wrap('<div class="ui-slidemenu-wrapper" />').
                    after('<div class="ui-slidemenu-backward ui-widget-header ui-corner-all">\n\
                    <span class="ui-icon fa fa-fw fa-caret-left"></span>Back</div>').
                    wrap('<div class="ui-slidemenu-content" />');
            
            this.element.parent().uniqueId();
            this.options.id = this.element.parent().attr('id');
          
            this.element.find('li').each(function() {
                    var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');
                    
                    menuitemLink.addClass('ui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');
                    
                    if(icon) {
                        menuitemLink.prepend('<span class="ui-menuitem-icon fa fa-fw ' + icon + '"></span>');
                    }
                    
                    listItem.addClass('ui-menuitem ui-widget ui-corner-all');
                    if(listItem.children('ul').length > 0) {
                        listItem.addClass('ui-menu-parent');
                        listItem.children('ul').addClass('ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
                        menuitemLink.prepend('<span class="ui-submenu-icon fa fa-fw fa-caret-right"></span>');
                    }
            });
        },
              
        _bindEvents: function() {
            var $this = this;

            this.links.on('mouseenter.ui-menu',function() {
               $(this).addClass('ui-state-hover'); 
            })
            .on('mouseleave.ui-menu',function() {
               $(this).removeClass('ui-state-hover'); 
            })
            .on('click.ui-menu',function() {
               var link = $(this),
               submenu = link.next();

               if(submenu.length == 1) {
                   $this._forward(submenu);
               }
            });

            this.backward.on('click.ui-menu',function() {
                $this._back();
            });
       },

       _forward: function(submenu) {
            var $this = this;

            this._push(submenu);

            var rootLeft = -1 * (this._depth() * this.jqWidth);

            submenu.show().css({
                left: this.jqWidth
            });

            this.rootList.animate({
                left: rootLeft
            }, 500, 'easeInOutCirc', function() {
                if($this.backward.is(':hidden')) {
                    $this.backward.fadeIn('fast');
                }
            });
       },

       _back: function() {
            if(!this.rootList.is(':animated')) {
                var $this = this,
                last = this._pop(),
                depth = this._depth();

                var rootLeft = -1 * (depth * this.jqWidth);

                this.rootList.animate({
                    left: rootLeft
                }, 500, 'easeInOutCirc', function() {
                    if(last) {
                        last.hide();
                    }

                    if(depth === 0) {
                        $this.backward.fadeOut('fast');
                    }
                });
            }
       },

       _push: function(submenu) {
             this.stack.push(submenu);
       },
    
       _pop: function() {
             return this.stack.pop();
       },

       _last: function() {
            return this.stack[this.stack.length - 1];
        },

       _depth: function() {
            return this.stack.length;
        },

       _applyDimensions: function() {
            this.submenus.width(this.container.width());
            this.wrapper.height(this.rootList.outerHeight(true) + this.backward.outerHeight(true));
            this.content.height(this.rootList.outerHeight(true));
            this.rendered = true;
        },

       show: function() {                
            this.align();
            this.container.css('z-index', ++PUI.zindex).show();

            if(!this.rendered) {
                this._applyDimensions();
            }
        }        
    });

})();

/**
 * PrimeUI Context Menu Widget
 */
(function() {

    $.widget("primeui.puicontextmenu", $.primeui.puitieredmenu, {
        
        options: {
            autoDisplay: true,
            target: null,
            event: 'contextmenu'
        },
        
        _create: function() {
            this._super();
            this.element.parent().removeClass('ui-tieredmenu').
                    addClass('ui-contextmenu ui-menu-dynamic ui-shadow');
            
            var $this = this;
            
            if(this.options.target) {
                if($.type(this.options.trigger) === 'string') {
                    this.options.trigger =  $(this.options.trigger);
                }
            }
            else {
                this.options.target = $(document);
            }
                
            if(!this.element.parent().parent().is(document.body)) {
                this.element.parent().appendTo('body');
            }
            
            if(this.options.target.hasClass('ui-datatable')) {
                $this._bindDataTable();
            }
            else {
                this.options.target.on(this.options.event + '.ui-contextmenu' , function(e){
                    $this.show(e);
                });   
            }
        },        

        _bindItemEvents: function() {
            this._super();

            var $this = this;

            //hide menu on item click
            this.links.bind('click', function() {
                $this._hide();
            });
        },

        _bindDocumentHandler: function() {
            var $this = this;

            //hide overlay when document is clicked
            $(document.body).on('click.ui-contextmenu', function (e) {
                if($this.element.parent().is(":hidden")) {
                    return;
                }

                $this._hide();
            });
        },
        
        _bindDataTable: function() {
            var rowSelector = '#' + this.options.target.attr('id') + ' tbody.ui-datatable-data > tr.ui-widget-content:not(.ui-datatable-empty-message)',
            event = this.options.event + '.ui-datatable',
            $this = this;

            $(document).off(event, rowSelector)
                        .on(event, rowSelector, null, function(e) {
                            $this.options.target.puidatatable('onRowRightClick', event, $(this));
                            $this.show(e);
                        });

        },
        
        show: function(e) {  
            //hide other contextmenus if any
            $(document.body).children('.ui-contextmenu:visible').hide();

            var win = $(window),
            left = e.pageX,
            top = e.pageY,
            width = this.element.parent().outerWidth(),
            height = this.element.parent().outerHeight();

            //collision detection for window boundaries
            if((left + width) > (win.width())+ win.scrollLeft()) {
                left = left - width;
            }
            if((top + height ) > (win.height() + win.scrollTop())) {
                top = top - height;
            }

            if(this.options.beforeShow) {
                this.options.beforeShow.call(this);
            }

            this.element.parent().css({
                'left': left,
                'top': top,
                'z-index': ++PUI.zindex
            }).show();

            e.preventDefault();
            e.stopPropagation();
        },

        _hide: function() {
            var $this = this;

            //hide submenus
            this.element.parent().find('li.ui-menuitem-active').each(function() {
                $this._deactivate($(this), true);
            });

            this.element.parent().fadeOut('fast');
        },

        isVisible: function() {
            return this.element.parent().is(':visible');
        },

        getTarget: function() {
            return this.jqTarget;
        }              
              
    });

})();
/**
 * PrimeUI Menu widgets
 */
 (function (factory) {
     if (typeof define === 'function' && define.amd) {
         // AMD. Register as an anonymous module.
         define(['jquery'], factory);
     } else if (typeof module === 'object' && module.exports) {
         // Node/CommonJS
         module.exports = function( root, jQuery ) {
             factory(jQuery);
             return jQuery;
         };
     } else {
         // Browser globals
         factory(jQuery);
     }
 }(function ($) {

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
            $(document.body).on('click.ui-menu-' + this.id, function (e) {
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
            $(window).on('resize.ui-menu-' + this.id, function() {
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
        },

        _destroy: function() {
            if(this.options.popup) {
                $(document.body).off('click.ui-menu-' + this.id);
                $(window).off('resize.ui-menu-' + this.id);
                this.options.trigger.off(this.options.triggerEvent + '.ui-menu');
            }
        }
    });

    $.widget("primeui.puimenu", $.primeui.puibasemenu, {

        options: {
            enhanced: false
        },

        _create: function() {
            var $this = this;

            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }

            if(!this.options.enhanced) {
                this.element.wrap('<div class="ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix"></div>');
            }

            this.container = this.element.parent();
            this.originalParent = this.container.parent();

            this.element.addClass('ui-menu-list ui-helper-reset');

            this.element.children('li').each(function() {
                var listItem = $(this);

                if(listItem.children('h3').length > 0) {
                    listItem.addClass('ui-widget-header ui-corner-all');
                }
                else {
                    listItem.addClass('ui-menuitem ui-widget ui-corner-all');
                    var menuitemLink = listItem.children('a'),
                        icon = menuitemLink.data('icon');

                    menuitemLink.addClass('ui-menuitem-link ui-corner-all');

                    if($this.options.enhanced)
                        menuitemLink.children('span').addClass('ui-menuitem-text');
                    else
                        menuitemLink.contents().wrap('<span class="ui-menuitem-text" />');

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
        },

        _unbindEvents: function() {
            this.menuitemLinks.off('mouseenter.ui-menu mouseleave.ui-menu');
            if(this.options.popup) {
                this.menuitemLinks.off('click.ui-menu');
            }
        },

        _destroy: function() {
            this._super();

            var $this = this;
            this._unbindEvents();

            this.element.removeClass('ui-menu-list ui-helper-reset');
            this.element.children('li.ui-widget-header').removeClass('ui-widget-header ui-corner-all');
            this.element.children('li:not(.ui-widget-header)').removeClass('ui-menuitem ui-widget ui-corner-all')
                .children('a').removeClass('ui-menuitem-link ui-corner-all').each(function() {
                var link = $(this);
                link.children('.ui-menuitem-icon').remove();

                if($this.options.enhanced)
                    link.children('.ui-menuitem-text').removeClass('ui-menuitem-text');
                else
                    link.children('.ui-menuitem-text').contents().unwrap();
            });

            if(this.options.popup) {
                this.container.appendTo(this.originalParent);
            }

            if(!this.options.enhanced) {
                this.element.unwrap();
            }
        }
    });

    $.widget("primeui.puibreadcrumb", {

        _create: function() {
            var $this = this;

            if(!this.options.enhanced) {
                this.element.wrap('<div class="ui-breadcrumb ui-module ui-widget ui-widget-header ui-helper-clearfix ui-corner-all" role="menu">');
            }
            this.element.children('li').each(function(index) {
                var listItem = $(this);
                listItem.attr('role', 'menuitem');
                var menuitemLink = listItem.children('a');
                menuitemLink.addClass('ui-menuitem-link');

                if($this.options.enhanced)
                    menuitemLink.children('span').addClass('ui-menuitem-text');
                else
                    menuitemLink.contents().wrap('<span class="ui-menuitem-text" />');

                if(index > 0) {
                    listItem.before('<li class="ui-breadcrumb-chevron fa fa-chevron-right"></li>');
                }
                else {
                    listItem.before('<li class="fa fa-home"></li>');
                }
            });
        },

        _destroy: function() {
            var $this = this;
            if(!this.options.enhanced) {
                this.unwrap();
            }
            this.element.children('li.ui-breadcrumb-chevron,.fa-home').remove();
            this.element.children('li').each(function() {
                var listItem = $(this),
                    link = listItem.children('a');

                link.removeClass('ui-menuitem-link');
                if($this.options.enhanced)
                    link.children('.ui-menuitem-text').removeClass('ui-menuitem-text');
                else
                    link.children('.ui-menuitem-text').contents().unwrap();
            });
        }
    });

    $.widget("primeui.puitieredmenu", $.primeui.puibasemenu, {

        options: {
            autoDisplay: true
        },

        _create: function() {
            var $this = this;

            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }

            if(!this.options.enhanced) {
                this.element.wrap('<div class="ui-tieredmenu ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix"></div>');
            }

            this.container = this.element.parent();
            this.originalParent = this.container.parent();

            this.element.addClass('ui-menu-list ui-helper-reset');

            this.element.find('li').each(function() {
                var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');

                menuitemLink.addClass('ui-menuitem-link ui-corner-all');

                if($this.options.enhanced)
                    menuitemLink.children('span').addClass('ui-menuitem-text');
                else
                    menuitemLink.contents().wrap('<span class="ui-menuitem-text" />');

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

            this.links = this.element.find('.ui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();

            this._super();
        },

        _bindEvents: function() {
            this._bindItemEvents();
            this._bindDocumentHandler();
        },

        _bindItemEvents: function() {
            var $this = this;

            this.links.on('mouseenter.ui-menu', function() {
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
                this.rootLinks.data('primeui-tieredmenu-rootlink', this.id).find('*').data('primeui-tieredmenu-rootlink', this.id);

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

            $(document.body).on('click.ui-menu-' + this.id, function(e) {
                var target = $(e.target);
                if(target.data('primeui-tieredmenu-rootlink') === $this.id) {
                    return;
                }

                $this.active = false;

                $this.element.find('li.ui-menuitem-active').each(function() {
                    $this._deactivate($(this), true);
                });
            });
        },

        _unbindEvents: function() {
            this.links.off('mouseenter.ui-menu');
            if(this.options.autoDisplay === false) {
                this.rootLinks.off('click.ui-menu');
            }
            this.element.parent().find('ul.ui-menu-list').off('mouseleave.ui-menu');
            $(document.body).off('click.ui-menu-' + this.id);
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
        },

        _destroy: function() {
            this._super();

            var $this = this;
            this._unbindEvents();

            this.element.removeClass('ui-menu-list ui-helper-reset');
            this.element.find('li').removeClass('ui-menuitem ui-widget ui-corner-all ui-menu-parent').each(function() {
                var listItem = $(this),
                link = listItem.children('a');

                link.removeClass('ui-menuitem-link ui-corner-all').children('.fa').remove();

                if($this.options.enhanced)
                    link.children('.ui-menuitem-text').removeClass('ui-menuitem-text');
                else
                    link.children('.ui-menuitem-text').contents().unwrap();

                listItem.children('ul').removeClass('ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
            });

            if(this.options.popup) {
                this.container.appendTo(this.originalParent);
            }

            if(!this.options.enhanced) {
                this.element.unwrap();
            }
        }

    });

    $.widget("primeui.puimenubar", $.primeui.puitieredmenu, {

        options: {
            autoDisplay: true,
            enhanced: false
        },

        _create: function() {
            this._super();

            if(!this.options.enhanced) {
                this.element.parent().removeClass('ui-tieredmenu').addClass('ui-menubar');
            }
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

    $.widget("primeui.puislidemenu", $.primeui.puibasemenu, {

        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }

            this._render();

            //elements
            this.rootList = this.element;
            this.content = this.element.parent();
            this.wrapper = this.content.parent();
            this.container = this.wrapper.parent();
            this.originalParent = this.container.parent();
            this.submenus = this.container.find('ul.ui-menu-list');

            this.links = this.element.find('a.ui-menuitem-link:not(.ui-state-disabled)');
            this.backward = this.wrapper.children('div.ui-slidemenu-backward');

            //config
            this.stack = [];
            this.jqWidth = this.container.width();

            if(!this.options.popup) {
                var $this = this;
                setTimeout(function() {
                    $this._applyDimensions();
                }, 100);

            }

            this._bindEvents();

            this._super();
        },

        _render: function() {
            var $this = this;

            if(!this.options.enhanced) {
                this.element.wrap('<div class="ui-menu ui-slidemenu ui-widget ui-widget-content ui-corner-all"></div>')
                    .wrap('<div class="ui-slidemenu-wrapper"></div>')
                    .wrap('<div class="ui-slidemenu-content"></div>');

                this.element.parent().after('<div class="ui-slidemenu-backward ui-widget-header ui-corner-all"><span class="fa fa-fw fa-caret-left"></span>Back</div>');
            }
            this.element.addClass('ui-menu-list ui-helper-reset');

            this.element.find('li').each(function() {
                var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');

                menuitemLink.addClass('ui-menuitem-link ui-corner-all');

                if($this.options.enhanced)
                    menuitemLink.children('span').addClass('ui-menuitem-text');
                else
                    menuitemLink.contents().wrap('<span class="ui-menuitem-text" />');

                if(icon) {
                    menuitemLink.prepend('<span class="ui-menuitem-icon fa fa-fw ' + icon + '"></span>');
                }

                listItem.addClass('ui-menuitem ui-widget ui-corner-all');

                if(listItem.children('ul').length) {
                    listItem.addClass('ui-menu-parent');
                    listItem.children('ul').addClass('ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
                    menuitemLink.prepend('<span class="ui-submenu-icon fa fa-fw fa-caret-right"></span>');
                }
            });
        },

        _destroy: function() {
            this._super();
            this._unbindEvents();

            var $this = this;

            this.element.removeClass('ui-menu-list ui-helper-reset');
            this.element.find('li').removeClass('ui-menuitem ui-widget ui-corner-all ui-menu-parent').each(function() {
                var listItem = $(this),
                link = listItem.children('a');

                link.removeClass('ui-menuitem-link ui-corner-all').children('.fa').remove();

                if($this.options.enhanced)
                    link.children('.ui-menuitem-text').removeClass('ui-menuitem-text');
                else
                    link.children('.ui-menuitem-text').contents().unwrap();

                listItem.children('ul').removeClass('ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
            });

            if(this.options.popup) {
                this.container.appendTo(this.originalParent);
            }

            if(!this.options.enhanced) {
                this.content.next('.ui-slidemenu-backward').remove();
                this.element.unwrap().unwrap().unwrap();
            }
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

        _unbindEvents: function() {
            this.links.off('mouseenter.ui-menu mouseleave.ui-menu click.ui-menu');
            this.backward.off('click.ui-menu');
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
                this.options.target =  $(this.options.target);
                
                if(this.options.target.hasClass('ui-datatable')) {
                    $this._bindDataTable();
                }
                else {
                    this.options.target.on(this.options.event + '.ui-contextmenu', function(e){
                        $this.show(e);
                    });
                }
            }

            if(!this.element.parent().parent().is(document.body)) {
                this.element.parent().appendTo('body');
            }
        },

        _bindDocumentHandler: function() {
            var $this = this;

            //hide overlay when document is clicked
            $(document.body).on('click.ui-contextmenu.' + this.id, function (e) {
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

        _unbindDataTable: function() {
            $(document).off(this.options.event + '.ui-datatable',
                        '#' + this.options.target.attr('id') + ' tbody.ui-datatable-data > tr.ui-widget-content:not(.ui-datatable-empty-message)');
        },

        _unbindEvents: function() {
            this._super();

            if(this.options.target) {
                if(this.options.target.hasClass('ui-datatable'))
                    this._unbindDataTable();
                else 
                    this.options.target.off(this.options.event + '.ui-contextmenu');
            }
            
            $(document.body).off('click.ui-contextmenu.' + this.id);
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
        },

        _destroy: function() {
            var $this = this;
            this._unbindEvents();

            this.element.removeClass('ui-menu-list ui-helper-reset');
            this.element.find('li').removeClass('ui-menuitem ui-widget ui-corner-all ui-menu-parent').each(function() {
                var listItem = $(this),
                link = listItem.children('a');

                link.removeClass('ui-menuitem-link ui-corner-all').children('.fa').remove();

                if($this.options.enhanced)
                    link.children('.ui-menuitem-text').removeClass('ui-menuitem-text');
                else
                    link.children('.ui-menuitem-text').contents().unwrap();

                listItem.children('ul').removeClass('ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
            });

            this.container.appendTo(this.originalParent);

            if(!this.options.enhanced) {
                this.element.unwrap();
            }
        }

    });

    $.widget("primeui.puimegamenu", $.primeui.puibasemenu, {

        options: {
            autoDisplay: true,
            orientation:'horizontal',
            enhanced: false
        },

        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }

            this._render();

            this.rootList = this.element.children('ul');
            this.rootLinks = this.rootList.children('li').children('a');
            this.subLinks = this.element.find('.ui-megamenu-panel a.ui-menuitem-link');
            this.keyboardTarget = this.element.children('.ui-helper-hidden-accessible');

            this._bindEvents();
            this._bindKeyEvents();
        },

        _render: function() {
            var $this = this;

            if(!this.options.enhanced) {
                this.element.prepend('<div tabindex="0" class="ui-helper-hidden-accessible"></div>');
                this.element.addClass('ui-menu ui-menubar ui-megamenu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix');
                if(this._isVertical()) {
                    this.element.addClass('ui-megamenu-vertical');
                }
            }

            this.element.children('ul').addClass('ui-menu-list ui-helper-reset');

            this.element.find('li').each(function(){
                var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');

                menuitemLink.addClass('ui-menuitem-link ui-corner-all');

                if($this.options.enhanced)
                    menuitemLink.children('span').addClass('ui-menuitem-text');
                else
                    menuitemLink.contents().wrap('<span class="ui-menuitem-text" />');

                if(icon) {
                    menuitemLink.prepend('<span class="ui-menuitem-icon fa fa-fw ' + icon + '"></span>');
                }

                listItem.addClass('ui-menuitem ui-widget ui-corner-all');
                listItem.parent().addClass('ui-menu-list ui-helper-reset');

                if(listItem.children('h3').length) {
                    listItem.addClass('ui-widget-header ui-corner-all');
                    listItem.removeClass('ui-widget ui-menuitem');
                }
                else if(listItem.children('div').length) {
                    var submenuIcon = $this._isVertical() ? 'fa-caret-right' : 'fa-caret-down';
                    listItem.addClass('ui-menu-parent');
                    listItem.children('div').addClass('ui-megamenu-panel ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
                    menuitemLink.addClass('ui-submenu-link').prepend('<span class="ui-submenu-icon fa fa-fw ' + submenuIcon + '"></span>');
                }
            });
        },

        _destroy: function() {
            var $this = this;
            this._unbindEvents();
            if(!this.options.enhanced) {
                this.element.children('.ui-helper-hidden-accessible').remove();
                this.element.removeClass('ui-menu ui-menubar ui-megamenu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix ui-megamenu-vertical');
            }

            this.element.find('li').each(function(){
                var listItem = $(this),
                    menuitemLink = listItem.children('a');

                menuitemLink.removeClass('ui-menuitem-link ui-corner-all');

                if($this.options.enhanced)
                    menuitemLink.children('span').removeClass('ui-menuitem-text');
                else
                    menuitemLink.contents().unwrap();

                menuitemLink.children('.ui-menuitem-icon').remove();

                listItem.removeClass('ui-menuitem ui-widget ui-corner-all')
                    .parent().removeClass('ui-menu-list ui-helper-reset');

                if(listItem.children('h3').length) {
                    listItem.removeClass('ui-widget-header ui-corner-all');
                }
                else if(listItem.children('div').length) {
                    var submenuIcon = $this._isVertical() ? 'fa-caret-right' : 'fa-caret-down';
                    listItem.removeClass('ui-menu-parent');
                    listItem.children('div').removeClass('ui-megamenu-panel ui-widget-content ui-menu-list ui-corner-all ui-helper-clearfix ui-menu-child ui-shadow');
                    menuitemLink.removeClass('ui-submenu-link').children('.ui-submenu-icon').remove();
                }
            });
        },

        _bindEvents: function() {
            var $this = this;
      
            this.rootLinks.on('mouseenter.ui-megamenu', function(e) {
                var link = $(this),
                menuitem = link.parent();
                
                var current = menuitem.siblings('.ui-menuitem-active');
                if(current.length > 0) {
                    current.find('li.ui-menuitem-active').each(function() {
                        $this._deactivate($(this));
                    });
                    $this._deactivate(current, false);
                }
                
                if($this.options.autoDisplay||$this.active) {
                    $this._activate(menuitem);
                }
                else {
                    $this._highlight(menuitem);
                }
                
            });
            
            if(this.options.autoDisplay === false) {
                this.rootLinks.data('primefaces-megamenu', this.id).find('*').data('primefaces-megamenu', this.id)
                
                this.rootLinks.on('click.ui-megamenu', function(e) {
                    var link = $(this),
                    menuitem = link.parent(),
                    submenu = link.next();

                    if(submenu.length === 1) {
                        if(submenu.is(':visible')) {
                            $this.active = false;
                            $this._deactivate(menuitem, true);
                        }
                        else {                                        
                            $this.active = true;
                            $this._activate(menuitem);
                        }
                    }
                    
                    e.preventDefault();
                });
            }
            else {
                this.rootLinks.filter('.ui-submenu-link').on('click.ui-megamenu', function(e) {
                    e.preventDefault();
                });
            }

            this.subLinks.on('mouseenter.ui-megamenu', function() {
                if($this.activeitem && !$this.isRootLink($this.activeitem)) {
                    $this._deactivate($this.activeitem);    
                } 
                $this._highlight($(this).parent());
            })
            .on('mouseleave.ui-megamenu', function() {
                if($this.activeitem && !$this.isRootLink($this.activeitem)) {
                    $this._deactivate($this.activeitem);    
                }
                $(this).removeClass('ui-state-hover');
            });
            
            this.rootList.on('mouseleave.ui-megamenu', function(e) {
                var activeitem = $this.rootList.children('.ui-menuitem-active');
                if(activeitem.length === 1) {
                    $this._deactivate(activeitem, false);
                }
            });
            
            this.rootList.find('> li.ui-menuitem > ul.ui-menu-child').on('mouseleave.ui-megamenu', function(e) {            
                e.stopPropagation();
            });
            
            $(document.body).on('click.' + this.id, function(e) {
                var target = $(e.target);
                if(target.data('primefaces-megamenu') === $this.id) {
                    return;
                }
                
                $this.active = false;
                $this._deactivate($this.rootList.children('li.ui-menuitem-active'), true);
            });
        },

        _unbindEvents: function() {
            this.rootLinks.off('mouseenter.ui-megamenu mouselave.ui-megamenu click.ui-megamenu');
            this.subLinks.off('mouseenter.ui-megamenu mouselave.ui-megamenu');
            this.rootList.off('mouseleave.ui-megamenu');
            this.rootList.find('> li.ui-menuitem > ul.ui-menu-child').off('mouseleave.ui-megamenu');
            $(document.body).off('click.' + this.id);
        },

        _isVertical: function () {
            if(this.options.orientation === 'vertical')
                return true;
            else
                return false;
        },

        _deactivate: function(menuitem, animate) {
            var link = menuitem.children('a.ui-menuitem-link'),
                submenu = link.next();

            menuitem.removeClass('ui-menuitem-active');
            link.removeClass('ui-state-hover');
            this.activeitem = null;

            if(submenu.length > 0) {
                if(animate)
                    submenu.fadeOut('fast');
                else
                    submenu.hide();
            }
        },

        _activate: function(menuitem) {
            var submenu = menuitem.children('.ui-megamenu-panel'),
                $this = this;

            $this._highlight(menuitem);

            if(submenu.length > 0) {
                $this._showSubmenu(menuitem, submenu);
            }
        },

        _highlight: function(menuitem) {
            var link = menuitem.children('a.ui-menuitem-link');

            menuitem.addClass('ui-menuitem-active');
            link.addClass('ui-state-hover');
            this.activeitem = menuitem;
        },

        _showSubmenu: function(menuitem, submenu) {
            var pos = null;

            if(this._isVertical()) {
                pos = {
                    my: 'left top',
                    at: 'right top',
                    of: menuitem,
                    collision: 'flipfit'
                };
            }
            else {
                pos = {
                    my: 'left top',
                    at: 'left bottom',
                    of: menuitem,
                    collision: 'flipfit'
                };
            }

            submenu.css({
                'z-index': ++PUI.zindex
            });

            submenu.show().position(pos);
        },

        _bindKeyEvents: function() {
            var $this = this;

            this.keyboardTarget.on('focus.ui-megamenu', function(e) {
                    $this._highlight($this.rootLinks.eq(0).parent());
                })
                .on('blur.ui-megamenu', function() {
                    $this._reset();
                })
                .on('keydown.ui-megamenu', function(e) {
                    var currentitem = $this.activeitem;
                    if(!currentitem) {
                        return;
                    }

                    var isRootLink = $this._isRootLink(currentitem),
                        keyCode = $.ui.keyCode;

                    switch(e.which) {
                        case keyCode.LEFT:
                            if(isRootLink && !$this._isVertical()) {
                                var prevItem = currentitem.prevAll('.ui-menuitem:first');
                                if(prevItem.length) {
                                    $this._deactivate(currentitem);
                                    $this._highlight(prevItem);
                                }

                                e.preventDefault();
                            }
                            else {
                                if(currentitem.hasClass('ui-menu-parent') && currentitem.children('.ui-menu-child').is(':visible')) {
                                    $this._deactivate(currentitem);
                                    $this._highlight(currentitem);
                                }
                                else {
                                    var parentItem = currentitem.closest('.ui-menu-child').parent();
                                    if(parentItem.length) {
                                        $this._deactivate(currentitem);
                                        $this._deactivate(parentItem);
                                        $this._highlight(parentItem);
                                    }
                                }
                            }
                            break;

                        case keyCode.RIGHT:
                            if(isRootLink && !$this._isVertical()) {
                                var nextItem = currentitem.nextAll('.ui-menuitem:visible:first');
                                if(nextItem.length) {
                                    $this._deactivate(currentitem);
                                    $this._highlight(nextItem);
                                }

                                e.preventDefault();
                            }
                            else {
                                if(currentitem.hasClass('ui-menu-parent')) {
                                    var submenu = currentitem.children('.ui-menu-child');
                                    if(submenu.is(':visible')) {
                                        $this._highlight(submenu.find('.ui-menu-list:visible > .ui-menuitem:visible:first'));
                                    }
                                    else {
                                        $this._activate(currentitem);
                                    }
                                }
                            }
                            break;

                        case keyCode.UP:
                            if(!isRootLink || $this._isVertical()) {
                                var prevItem = $this._findPrevItem(currentitem);
                                if(prevItem.length) {
                                    $this._deactivate(currentitem);
                                    $this._highlight(prevItem);
                                }
                            }

                            e.preventDefault();
                            break;

                        case keyCode.DOWN:
                            if(isRootLink && !$this._isVertical()) {
                                var submenu = currentitem.children('.ui-menu-child');
                                if(submenu.is(':visible')) {
                                    var firstMenulist = $this._getFirstMenuList(submenu);
                                    $this._highlight(firstMenulist.children('.ui-menuitem:visible:first'));
                                }
                                else {
                                    $this._activate(currentitem);
                                }
                            }
                            else {
                                var nextItem = $this._findNextItem(currentitem);
                                if(nextItem.length) {
                                    $this._deactivate(currentitem);
                                    $this._highlight(nextItem);
                                }
                            }

                            e.preventDefault();
                            break;

                        case keyCode.ENTER:
                        case keyCode.NUMPAD_ENTER:
                            var currentLink = currentitem.children('.ui-menuitem-link');
                            currentLink.trigger('click');
                            $this.element.blur();
                            var href = currentLink.attr('href');
                            if(href && href !== '#') {
                                window.location.href = href;
                            }
                            $this._deactivate(currentitem);
                            e.preventDefault();
                            break;

                        case keyCode.ESCAPE:
                            if(currentitem.hasClass('ui-menu-parent')) {
                                var submenu = currentitem.children('.ui-menu-list:visible');
                                if(submenu.length > 0) {
                                    submenu.hide();
                                }
                            }
                            else {
                                var parentItem = currentitem.closest('.ui-menu-child').parent();
                                if(parentItem.length) {
                                    $this._deactivate(currentitem);
                                    $this._deactivate(parentItem);
                                    $this._highlight(parentItem);
                                }
                            }
                            e.preventDefault();
                            break;
                    }
                });
        },

        _findPrevItem: function(menuitem) {
            var previtem = menuitem.prev('.ui-menuitem');

            if(!previtem.length) {
                var prevSubmenu = menuitem.closest('ul.ui-menu-list').prev('.ui-menu-list');

                if(!prevSubmenu.length) {
                    prevSubmenu = menuitem.closest('div').prev('div').children('.ui-menu-list:visible:last');
                }

                if(prevSubmenu.length) {
                    previtem = prevSubmenu.find('li.ui-menuitem:visible:last');
                }
            }
            return previtem;
        },

        _findNextItem: function(menuitem) {
            var nextitem = menuitem.next('.ui-menuitem');

            if(!nextitem.length) {
                var nextSubmenu = menuitem.closest('ul.ui-menu-list').next('.ui-menu-list');
                if(!nextSubmenu.length) {
                    nextSubmenu = menuitem.closest('div').next('div').children('.ui-menu-list:visible:first');
                }

                if(nextSubmenu.length) {
                    nextitem = nextSubmenu.find('li.ui-menuitem:visible:first');
                }
            }
            return nextitem;
        },

        _getFirstMenuList: function(submenu) {
            return submenu.find('.ui-menu-list:not(.ui-state-disabled):first');
        },

        _isRootLink: function(menuitem) {
            var submenu = menuitem.closest('ul');
            return submenu.parent().hasClass('ui-menu');
        },

        _reset: function() {
            var $this = this;
            this.active = false;

            this.element.find('li.ui-menuitem-active').each(function() {
                $this._deactivate($(this), true);
            });
        },
        
        isRootLink: function(menuitem) {
            var submenu = menuitem.closest('ul');
            return submenu.parent().hasClass('ui-menu');
        }

    });

    $.widget("primeui.puipanelmenu", $.primeui.puibasemenu, {

        options: {
            stateful: false,
            enhanced: false
        },

        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }

            this.panels = this.element.children('div');

            this._render();

            this.headers = this.element.find('> .ui-panelmenu-panel > div.ui-panelmenu-header:not(.ui-state-disabled)');
            this.contents = this.element.find('> .ui-panelmenu-panel > .ui-panelmenu-content');
            this.menuitemLinks = this.contents.find('.ui-menuitem-link:not(.ui-state-disabled)');
            this.treeLinks = this.contents.find('.ui-menu-parent > .ui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();

            if(this.options.stateful) {
                this.stateKey = 'panelMenu-' + this.id;
            }

            this._restoreState();
        },

        _render: function() {
            var $this = this;

            if(!this.options.enhanced) {
                this.element.addClass('ui-panelmenu ui-widget');
            }
            this.panels.addClass('ui-panelmenu-panel');

            this.element.find('li').each(function(){
                var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');

                menuitemLink.addClass('ui-menuitem-link ui-corner-all')

                if($this.options.enhanced)
                    menuitemLink.children('span').addClass('ui-menuitem-text');
                else
                    menuitemLink.contents().wrap('<span class="ui-menuitem-text" />');

                if(icon) {
                    menuitemLink.prepend('<span class="ui-menuitem-icon fa fa-fw ' + icon + '"></span>');
                }

                if(listItem.children('ul').length) {
                    listItem.addClass('ui-menu-parent');
                    menuitemLink.prepend('<span class="ui-panelmenu-icon fa fa-fw fa-caret-right"></span>');
                    listItem.children('ul').addClass('ui-helper-hidden');

                    if(icon) {
                        menuitemLink.addClass('ui-menuitem-link-hasicon');
                    }
                }

                listItem.addClass('ui-menuitem ui-widget ui-corner-all');
                listItem.parent().addClass('ui-menu-list ui-helper-reset');
            });

            //headers
            this.panels.children(':first-child').attr('tabindex', '0').each(function () {
                var header = $(this),
                    headerLink = header.children('a'),
                    icon = headerLink.data('icon');

                if(icon) {
                    headerLink.addClass('ui-panelmenu-headerlink-hasicon').prepend('<span class="ui-menuitem-icon fa fa-fw ' + icon + '"></span>');
                }

                header.addClass('ui-widget ui-panelmenu-header ui-state-default ui-corner-all').prepend('<span class="ui-panelmenu-icon fa fa-fw fa-caret-right"></span>');
            });

            //contents
            this.panels.children(':last-child').attr('tabindex', '0').addClass('ui-panelmenu-content ui-widget-content ui-helper-hidden');
        },

        _destroy: function() {
            var $this = this;
            this._unbindEvents();

            if(!this.options.enhanced) {
                this.element.removeClass('ui-panelmenu ui-widget');
            }

            this.panels.removeClass('ui-panelmenu-panel');
            this.headers.removeClass('ui-widget ui-panelmenu-header ui-state-default ui-state-hover ui-state-active ui-corner-all ui-corner-top').removeAttr('tabindex');
            this.contents.removeClass('ui-panelmenu-content ui-widget-content ui-helper-hidden').removeAttr('tabindex')
            this.contents.find('ul').removeClass('ui-menu-list ui-helper-reset ui-helper-hidden');

            this.headers.each(function () {
                var header = $(this),
                    headerLink = header.children('a');

                header.children('.fa').remove();
                headerLink.removeClass('ui-panelmenu-headerlink-hasicon');
                headerLink.children('.fa').remove();
            });

            this.element.find('li').each(function(){
                var listItem = $(this),
                    menuitemLink = listItem.children('a');

                menuitemLink.removeClass('ui-menuitem-link ui-corner-all ui-menuitem-link-hasicon');

                if($this.options.enhanced)
                    menuitemLink.children('span').removeClass('ui-menuitem-text');
                else
                    menuitemLink.contents().unwrap();

                menuitemLink.children('.fa').remove();

                listItem.removeClass('ui-menuitem ui-widget ui-corner-all ui-menu-parent')
                    .parent().removeClass('ui-menu-list ui-helper-reset ui-helper-hidden ');
            });
        },

        _unbindEvents: function() {
            this.headers.off('mouseover.ui-panelmenu mouseout.ui-panelmenu click.ui-panelmenu');
            this.menuitemLinks.off('mouseover.ui-panelmenu mouseout.ui-panelmenu click.ui-panelmenu');
            this.treeLinks.off('click.ui-panelmenu');
            this._unbindKeyEvents();
        },

        _bindEvents: function() {
            var $this = this;

            this.headers.on('mouseover.ui-panelmenu', function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')) {
                    element.addClass('ui-state-hover');
                }
            }).on('mouseout.ui-panelmenu', function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')) {
                    element.removeClass('ui-state-hover');
                }
            }).on('click.ui-panelmenu', function(e) {
                var header = $(this);

                if(header.hasClass('ui-state-active'))
                    $this._collapseRootSubmenu($(this));
                else
                    $this._expandRootSubmenu($(this), false);

                $this._removeFocusedItem();
                header.focus();
                e.preventDefault();
            });

            this.menuitemLinks.on('mouseover.ui-panelmenu', function() {
                $(this).addClass('ui-state-hover');
            }).on('mouseout.ui-panelmenu', function() {
                $(this).removeClass('ui-state-hover');
            }).on('click.ui-panelmenu', function(e) {
                var currentLink = $(this);
                $this._focusItem(currentLink.closest('.ui-menuitem'));

                var href = currentLink.attr('href');
                if(href && href !== '#') {
                    window.location.href = href;
                }
                e.preventDefault();
            });

            this.treeLinks.on('click.ui-panelmenu', function(e) {
                var link = $(this),
                    submenu = link.parent(),
                    submenuList = link.next();

                if(submenuList.is(':visible')) {
                    if(link.children('span.fa-caret-down').length) {
                        link.children('span.fa-caret-down').removeClass('fa-caret-down').addClass('fa-caret-right');
                    }
                    $this._collapseTreeItem(submenu);
                }
                else {
                    if(link.children('span.fa-caret-right').length) {
                        link.children('span.fa-caret-right').removeClass('fa-caret-right').addClass('fa-caret-down');
                    }

                    $this._expandTreeItem(submenu, false);
                }

                e.preventDefault();
            });

            this._bindKeyEvents();
        },

        _bindKeyEvents: function() {
            var $this = this;

            if(PUI.isIE()) {
                this.focusCheck = false;
            }

            this.headers.on('focus.panelmenu', function(){
                    $(this).addClass('ui-menuitem-outline');
                })
                .on('blur.panelmenu', function(){
                    $(this).removeClass('ui-menuitem-outline ui-state-hover');
                })
                .on('keydown.panelmenu', function(e) {
                    var keyCode = $.ui.keyCode,
                        key = e.which;

                    if(key === keyCode.SPACE || key === keyCode.ENTER || key === keyCode.NUMPAD_ENTER) {
                        $(this).trigger('click');
                        e.preventDefault();
                    }
                });

            this.contents.on('mousedown.panelmenu', function(e) {
                if($(e.target).is(':not(:input:enabled)')) {
                    e.preventDefault();
                }
            }).on('focus.panelmenu', function(){
                if(!$this.focusedItem) {
                    $this._focusItem($this._getFirstItemOfContent($(this)));
                    if(PUI.isIE()) {
                        $this.focusCheck = false;
                    }
                }
            }).on('keydown.panelmenu', function(e) {
                if(!$this.focusedItem) {
                    return;
                }

                var keyCode = $.ui.keyCode;

                switch(e.which) {
                    case keyCode.LEFT:
                        if($this._isExpanded($this.focusedItem)) {
                            $this.focusedItem.children('.ui-menuitem-link').trigger('click');
                        }
                        else {
                            var parentListOfItem = $this.focusedItem.closest('ul.ui-menu-list');

                            if(parentListOfItem.parent().is(':not(.ui-panelmenu-content)')) {
                                $this._focusItem(parentListOfItem.closest('li.ui-menuitem'));
                            }
                        }

                        e.preventDefault();
                        break;

                    case keyCode.RIGHT:
                        if($this.focusedItem.hasClass('ui-menu-parent') && !$this._isExpanded($this.focusedItem)) {
                            $this.focusedItem.children('.ui-menuitem-link').trigger('click');
                        }
                        e.preventDefault();
                        break;

                    case keyCode.UP:
                        var itemToFocus = null,
                            prevItem = $this.focusedItem.prev();

                        if(prevItem.length) {
                            itemToFocus = prevItem.find('li.ui-menuitem:visible:last');
                            if(!itemToFocus.length) {
                                itemToFocus = prevItem;
                            }
                        }
                        else {
                            itemToFocus = $this.focusedItem.closest('ul').parent('li');
                        }

                        if(itemToFocus.length) {
                            $this._focusItem(itemToFocus);
                        }

                        e.preventDefault();
                        break;

                    case keyCode.DOWN:
                        var itemToFocus = null,
                            firstVisibleChildItem = $this.focusedItem.find('> ul > li:visible:first');

                        if(firstVisibleChildItem.length) {
                            itemToFocus = firstVisibleChildItem;
                        }
                        else if($this.focusedItem.next().length) {
                            itemToFocus = $this.focusedItem.next();
                        }
                        else {
                            if($this.focusedItem.next().length === 0) {
                                itemToFocus = $this._searchDown($this.focusedItem);
                            }
                        }

                        if(itemToFocus && itemToFocus.length) {
                            $this._focusItem(itemToFocus);
                        }

                        e.preventDefault();
                        break;

                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                    case keyCode.SPACE:
                        var currentLink = $this.focusedItem.children('.ui-menuitem-link');
                        //IE fix
                        setTimeout(function(){
                            currentLink.trigger('click');
                        },1);
                        $this.element.blur();

                        var href = currentLink.attr('href');
                        if(href && href !== '#') {
                            window.location.href = href;
                        }
                        e.preventDefault();
                        break;

                    case keyCode.TAB:
                        if($this.focusedItem) {
                            if(PUI.isIE()) {
                                $this.focusCheck = true;
                            }
                            $(this).focus();
                        }
                        break;
                }
            }).on('blur.panelmenu', function(e) {
                if(PUI.isIE() && !$this.focusCheck) {
                    return;
                }

                $this._removeFocusedItem();
            });

            var clickNS = 'click.' + this.id;
            //remove focusedItem when document is clicked
            $(document.body).off(clickNS).on(clickNS, function(event) {
                if(!$(event.target).closest('.ui-panelmenu').length) {
                    $this._removeFocusedItem();
                }
            });
        },

        _unbindKeyEvents: function() {
            this.headers.off('focus.panelmenu blur.panelmenu keydown.panelmenu');
            this.contents.off('mousedown.panelmenu focus.panelmenu keydown.panelmenu blur.panelmenu');
            $(document.body).off('click.' + this.id);
        },

        _isExpanded: function(item) {
            return item.children('ul.ui-menu-list').is(':visible');
        },

        _searchDown: function(item) {
            var nextOfParent = item.closest('ul').parent('li').next(),
                itemToFocus = null;

            if(nextOfParent.length) {
                itemToFocus = nextOfParent;
            }
            else if(item.closest('ul').parent('li').length === 0){
                itemToFocus = item;
            }
            else {
                itemToFocus = this._searchDown(item.closest('ul').parent('li'));
            }

            return itemToFocus;
        },

        _getFirstItemOfContent: function(content) {
            return content.find('> .ui-menu-list > .ui-menuitem:visible:first-child');
        },

        _collapseRootSubmenu: function(header) {
            var panel = header.next();

            header.attr('aria-expanded', false).removeClass('ui-state-active ui-corner-top').addClass('ui-state-hover ui-corner-all');
            header.children('span.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
            panel.attr('aria-hidden', true).slideUp('normal', 'easeInOutCirc');

            this._removeAsExpanded(panel);
        },

        _expandRootSubmenu: function(header, restoring) {
            var panel = header.next();

            header.attr('aria-expanded', true).addClass('ui-state-active ui-corner-top').removeClass('ui-state-hover ui-corner-all');
            header.children('span.fa').removeClass('fa-caret-right').addClass('fa-caret-down');

            if(restoring) {
                panel.attr('aria-hidden', false).show();
            }
            else {
                panel.attr('aria-hidden', false).slideDown('normal', 'easeInOutCirc');

                this._addAsExpanded(panel);
            }
        },

        _restoreState: function() {
            var expandedNodeIds = null;

            if(this.options.stateful) {
                expandedNodeIds = PUI.getCookie(this.stateKey);
            }

            if(expandedNodeIds) {
                this._collapseAll();
                this.expandedNodes = expandedNodeIds.split(',');

                for(var i = 0 ; i < this.expandedNodes.length; i++) {
                    var element = $(PUI.escapeClientId(this.expandedNodes[i]));
                    if(element.is('div.ui-panelmenu-content'))
                        this._expandRootSubmenu(element.prev(), true);
                    else if(element.is('li.ui-menu-parent'))
                        this._expandTreeItem(element, true);
                }
            }
            else {
                this.expandedNodes = [];
                var activeHeaders = this.headers.filter('.ui-state-active'),
                    activeTreeSubmenus = this.element.find('.ui-menu-parent > .ui-menu-list:not(.ui-helper-hidden)');

                for(var i = 0; i < activeHeaders.length; i++) {
                    this.expandedNodes.push(activeHeaders.eq(i).next().attr('id'));
                }

                for(var i = 0; i < activeTreeSubmenus.length; i++) {
                    this.expandedNodes.push(activeTreeSubmenus.eq(i).parent().attr('id'));
                }
            }
        },

        _collapseAll: function() {
            this.headers.filter('.ui-state-active').each(function() {
                var header = $(this);
                header.removeClass('ui-state-active').next().addClass('ui-helper-hidden');
            });

            this.element.find('.ui-menu-parent > .ui-menu-list:not(.ui-helper-hidden)').each(function() {
                $(this).addClass('ui-helper-hidden');
            });
        },

        _removeAsExpanded: function(element) {
            var id = element.attr('id');

            this.expandedNodes = $.grep(this.expandedNodes, function(value) {
                return value != id;
            });

            this._saveState();
        },

        _addAsExpanded: function(element) {
            this.expandedNodes.push(element.attr('id'));

            this._saveState();
        },

        _removeFocusedItem: function() {
            if(this.focusedItem) {
                this._getItemText(this.focusedItem).removeClass('ui-menuitem-outline');
                this.focusedItem = null;
            }
        },

        _focusItem: function(item) {
            this._removeFocusedItem();
            this._getItemText(item).addClass('ui-menuitem-outline').focus();
            this.focusedItem = item;
        },

        _getItemText: function(item) {
            return item.find('> .ui-menuitem-link > span.ui-menuitem-text');
        },

        _expandTreeItem: function(submenu, restoring) {
            var submenuLink = submenu.find('> .ui-menuitem-link');

            submenuLink.find('> .ui-menuitem-text').attr('aria-expanded', true);
            submenu.children('.ui-menu-list').show();

            if(!restoring) {
                this._addAsExpanded(submenu);
            }
        },

        _collapseTreeItem: function(submenu) {
            var submenuLink = submenu.find('> .ui-menuitem-link');

            submenuLink.find('> .ui-menuitem-text').attr('aria-expanded', false);
            submenu.children('.ui-menu-list').hide();

            this._removeAsExpanded(submenu);
        },

        _removeAsExpanded: function(element) {
            var id = element.attr('id');

            this.expandedNodes = $.grep(this.expandedNodes, function(value) {
                return value != id;
            });

            this._saveState();
        },

        _addAsExpanded: function(element) {
            this.expandedNodes.push(element.attr('id'));

            this._saveState();
        },

        _saveState: function() {
            if(this.options.stateful) {
                var expandedNodeIds = this.expandedNodes.join(',');

                PUI.setCookie(this.stateKey, expandedNodeIds, {path:'/'});
            }
        },

        _clearState: function() {
            if(this.options.stateful) {
                PUI.deleteCookie(this.stateKey, {path:'/'});
            }
        }

    });

}));
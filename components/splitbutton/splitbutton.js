/**
 * PrimeFaces SplitButton Widget
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

    $.widget("primeui.puisplitbutton", {
       
        options: {
            icon: null,
            iconPos: 'left',
            items: null
        },
        
        _create: function() {
            this.element.wrap('<div class="ui-splitbutton ui-buttonset ui-widget"></div>');
            this.container = this.element.parent().uniqueId();
            this.menuButton = this.container.append('<button class="ui-splitbutton-menubutton" type="button"></button>').children('.ui-splitbutton-menubutton');
            this.options.disabled = this.element.prop('disabled');
            
            if(this.options.disabled) {
                this.menuButton.prop('disabled', true);
            }
            
            this.element.puibutton(this.options).removeClass('ui-corner-all').addClass('ui-corner-left');
            this.menuButton.puibutton({
                icon: 'fa-caret-down'
            }).removeClass('ui-corner-all').addClass('ui-corner-right');
            
            if(this.options.items && this.options.items.length) {            
                this._renderPanel();
                this._bindEvents();
            }

        },
                
        _renderPanel: function() {
            this.menu = $('<div class="ui-menu ui-menu-dynamic ui-widget ui-widget-content ui-corner-all ui-helper-clearfix ui-shadow"></div>').
                    append('<ul class="ui-menu-list ui-helper-reset"></ul>');
            this.menuList = this.menu.children('.ui-menu-list');
            
            for(var i = 0; i < this.options.items.length; i++) {
                var item = this.options.items[i],
                menuitem = $('<li class="ui-menuitem ui-widget ui-corner-all" role="menuitem"></li>'),
                link = $('<a class="ui-menuitem-link ui-corner-all"><span class="ui-menuitem-icon fa fa-fw ' + item.icon +'"></span><span class="ui-menuitem-text">' + item.text +'</span></a>');
                
                if(item.url) {
                    link.attr('href', item.url);
                }
                
                if(item.click) {
                    link.on('click.puisplitbutton', item.click);
                }
                
                menuitem.append(link).appendTo(this.menuList);
            }
            
            this.menu.appendTo(this.options.appendTo||this.container);
            
            this.options.position = {
                my: 'left top',
                at: 'left bottom',
                of: this.element.parent()
            };
        },
                
        _bindEvents: function() {  
            var $this = this;

            this.menuButton.on('click.puisplitbutton', function() {
                if($this.menu.is(':hidden'))
                    $this.show();
                else
                    $this.hide();
            });

            this.menuList.children().on('mouseover.puisplitbutton', function(e) {
                $(this).addClass('ui-state-hover');
            }).on('mouseout.puisplitbutton', function(e) {
                $(this).removeClass('ui-state-hover');
            }).on('click.puisplitbutton', function() {
                $this.hide();
            });
            
            $(document.body).bind('mousedown.' + this.container.attr('id'), function (e) {
                if($this.menu.is(":hidden")) {
                    return;
                }

                var target = $(e.target);
                if(target.is($this.element)||$this.element.has(target).length > 0) {
                    return;
                }

                var offset = $this.menu.offset();
                if(e.pageX < offset.left ||
                    e.pageX > offset.left + $this.menu.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.menu.height()) {

                    $this.element.removeClass('ui-state-focus ui-state-hover');
                    $this.hide();
                }
            });

            var resizeNS = 'resize.' + this.container.attr('id');
            $(window).unbind(resizeNS).bind(resizeNS, function() {
                if($this.menu.is(':visible')) {
                    $this._alignPanel();
                }
            });
        },
                
        show: function() {
            this.menuButton.trigger('focus');
            this.menu.show();
            this._alignPanel();
            this._trigger('show', null);
        },

        hide: function() {
            this.menuButton.removeClass('ui-state-focus');
            this.menu.fadeOut('fast');
            this._trigger('hide', null);
        },

        _alignPanel: function() {
            this.menu.css({left:'', top:'','z-index': ++PUI.zindex}).position(this.options.position);
        },

        disable: function() {
            this.element.puibutton('disable');
            this.menuButton.puibutton('disable');
        },

        enable: function() {
            this.element.puibutton('enable');
            this.menuButton.puibutton('enable');
        }
    });
    
}));
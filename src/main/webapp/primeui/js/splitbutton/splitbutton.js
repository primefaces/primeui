/**
 * PrimeFaces SplitButton Widget
 */
$(function() {

    $.widget("primeui.puisplitbutton", {
       
        options: {
            icon: null,
            iconPos: 'left',
            items: null
        },
        
        _create: function() {
            this.element.wrap('<div class="pui-splitbutton pui-buttonset ui-widget"></div>');
            this.container = this.element.parent().uniqueId();
            this.menuButton = this.container.append('<button class="pui-splitbutton-menubutton" type="button"></button>').children('.pui-splitbutton-menubutton');
            this.options.disabled = this.element.prop('disabled');
            
            if(this.options.disabled) {
                this.menuButton.prop('disabled', true);
            }
            
            this.element.puibutton(this.options).removeClass('ui-corner-all').addClass('ui-corner-left');
            this.menuButton.puibutton({
                icon: 'ui-icon-triangle-1-s'
            }).removeClass('ui-corner-all').addClass('ui-corner-right');
            
            if(this.options.items && this.options.items.length) {            
                this._renderPanel();
                this._bindEvents();
            }

        },
                
        _renderPanel: function() {
            this.menu = $('<div class="pui-menu pui-menu-dynamic ui-widget ui-widget-content ui-corner-all ui-helper-clearfix pui-shadow"></div>').
                    append('<ul class="pui-menu-list ui-helper-reset"></ul>');
            this.menuList = this.menu.children('.pui-menu-list');
            
            for(var i = 0; i < this.options.items.length; i++) {
                var item = this.options.items[i],
                menuitem = $('<li class="pui-menuitem ui-widget ui-corner-all" role="menuitem"></li>'),
                link = $('<a class="pui-menuitem-link ui-corner-all"><span class="pui-menuitem-icon ui-icon ' + item.icon +'"></span><span class="ui-menuitem-text">' + item.text +'</span></a>');
                
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
                of: this.element
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
            this._alignPanel();
            this.menuButton.trigger('focus');
            this.menu.show();
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
});
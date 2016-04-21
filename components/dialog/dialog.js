/**
 * PrimeUI Dialog Widget
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

    $.widget("primeui.puidialog", {
       
        options: {
            draggable: true,
            resizable: true,
            location: 'center',
            minWidth: 150,
            minHeight: 25,
            height: 'auto',
            width: '300px',
            visible: false,
            modal: false,
            showEffect: null,
            hideEffect: null,
            effectOptions: {},
            effectSpeed: 'normal',
            closeOnEscape: true,
            rtl: false,
            closable: true,
            minimizable: false,
            maximizable: false,
            appendTo: null,
            buttons: null,
            responsive: false,
            title: null,
            enhanced: false
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            //container
            if(!this.options.enhanced) {
                this.element.addClass('ui-dialog ui-widget ui-widget-content ui-helper-hidden ui-corner-all ui-shadow')
                        .contents().wrapAll('<div class="ui-dialog-content ui-widget-content" />');

                //header
                var title = this.options.title||this.element.attr('title');
                this.element.prepend('<div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">' +
                                '<span id="' + this.element.attr('id') + '_label" class="ui-dialog-title">' + title + '</span>')
                                .removeAttr('title');

                //footer
                if(this.options.buttons) {
                    this.footer = $('<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div>').appendTo(this.element);
                    for(var i = 0; i < this.options.buttons.length; i++) {
                        var buttonMeta = this.options.buttons[i],
                        button = $('<button type="button"></button>').appendTo(this.footer);
                        if(buttonMeta.text) {
                            button.text(buttonMeta.text);
                        }
                        
                        button.puibutton(buttonMeta);
                    }  
                }

                if(this.options.rtl) {
                    this.element.addClass('ui-dialog-rtl');
                }
            }
            
            //elements
            this.content = this.element.children('.ui-dialog-content');
            this.titlebar = this.element.children('.ui-dialog-titlebar');
            
            if(!this.options.enhanced) {
                if(this.options.closable) {
                    this._renderHeaderIcon('ui-dialog-titlebar-close', 'fa-close');
                }
                
                if(this.options.maximizable) {
                    this._renderHeaderIcon('ui-dialog-titlebar-maximize', 'fa-sort');
                }
                
                if(this.options.minimizable) {
                    this._renderHeaderIcon('ui-dialog-titlebar-minimize', 'fa-minus');
                }
            }
            
            //icons
            this.icons = this.titlebar.children('.ui-dialog-titlebar-icon');
            this.closeIcon = this.titlebar.children('.ui-dialog-titlebar-close');
            this.minimizeIcon = this.titlebar.children('.ui-dialog-titlebar-minimize');
            this.maximizeIcon = this.titlebar.children('.ui-dialog-titlebar-maximize');
            
            this.blockEvents = 'focus.puidialog mousedown.puidialog mouseup.puidialog keydown.puidialog keyup.puidialog';            
            this.parent = this.element.parent();
            
            //size
            this.element.css({'width': this.options.width, 'height': 'auto'});
            this.content.height(this.options.height);

            //events
            this._bindEvents();

            if(this.options.draggable) {
                this._setupDraggable();
            }

            if(this.options.resizable) {
                this._setupResizable();
            }

            if(this.options.appendTo) {
                this.element.appendTo(this.options.appendTo);
            }
            
            if(this.options.responsive) {
                this.resizeNS = 'resize.' + this.id;
            }

            //docking zone
            if($(document.body).children('.ui-dialog-docking-zone').length === 0) {
                $(document.body).append('<div class="ui-dialog-docking-zone"></div>');
            }

            //aria
            this._applyARIA();

            if(this.options.visible) {
                this.show();
            }
        },

        _destroy: function() {
            //restore dom
            if(!this.options.enhanced) {
                this.element.removeClass('ui-dialog ui-widget ui-widget-content ui-helper-hidden ui-corner-all ui-shadow');

                if(this.options.buttons) {
                    this.footer.children('button').puibutton('destroy');
                    this.footer.remove();
                }

                if(this.options.rtl) {
                    this.element.removeClass('ui-dialog-rtl');
                }

                var title = this.titlebar.children('.ui-dialog-title').text()||this.options.title;
                if(title) {
                    this.element.attr('title', title);
                }
                this.titlebar.remove();

                this.content.contents().unwrap();
            }

            //remove events
            this._unbindEvents();

            if(this.options.draggable) {
                this.element.draggable('destroy');
            }

            if(this.options.resizable) {
                this.element.resizable('destroy');
            }

            if(this.options.appendTo) {
                this.element.appendTo(this.parent);
            }
            
            this._unbindResizeListener();

            if(this.options.modal) {
                this._disableModality();
            }

            this._removeARIA();
            this.element.css({
                'width': 'auto',
                'height': 'auto'
            });
        },
        
        _renderHeaderIcon: function(styleClass, icon) {
            this.titlebar.append('<a class="ui-dialog-titlebar-icon ' + styleClass + ' ui-corner-all" href="#" role="button">' +
                                '<span class="fa fa-fw ' + icon + '"></span></a>');
        },
        
        _enableModality: function() {
            var $this = this,
            doc = $(document);

            this.modality = $('<div id="' + this.element.attr('id') + '_modal" class="ui-widget-overlay ui-dialog-mask"></div>').appendTo(document.body)
                                .css('z-index', this.element.css('z-index') - 1);

            //Disable tabbing out of modal dialog and stop events from targets outside of dialog
            doc.on('keydown.puidialog',
                    function(event) {
                        if(event.keyCode == $.ui.keyCode.TAB) {
                            var tabbables = $this.content.find(':tabbable'), 
                            first = tabbables.filter(':first'), 
                            last = tabbables.filter(':last');

                            if(event.target === last[0] && !event.shiftKey) {
                                first.focus(1);
                                return false;
                            } 
                            else if (event.target === first[0] && event.shiftKey) {
                                last.focus(1);
                                return false;
                            }
                        }
                    })
                    .bind(this.blockEvents, function(event) {
                        if ($(event.target).zIndex() < $this.element.zIndex()) {
                            return false;
                        }
                    });
        },

        _disableModality: function() {
            if(this.modality) {
                this.modality.remove();
                this.modality = null;
            }
            
            $(document).off(this.blockEvents).off('keydown.dialog');
        },

        show: function() {
            if(this.element.is(':visible')) {
                return;
            }

            if(!this.positionInitialized) {
                this._initPosition();
            }
            
            this._trigger('beforeShow', null);

            if(this.options.showEffect) {
                var $this = this;

                this.element.show(this.options.showEffect, this.options.effectOptions, this.options.effectSpeed, function() {
                    $this._postShow();
                });
            }    
            else {
                this.element.show();

                this._postShow();
            }

            this._moveToTop();

            if(this.options.modal) {
                this._enableModality();
            }
        },

        _postShow: function() {   
            //execute user defined callback
            this._trigger('afterShow', null);

            this.element.attr({
                'aria-hidden': false,
                'aria-live': 'polite'
            });

            this._applyFocus();
            
            if(this.options.responsive) {
                this._bindResizeListener();
            }
        },

        hide: function() {   
            if(this.element.is(':hidden')) {
                return;
            }
            
            this._trigger('beforeHide', null);

            if(this.options.hideEffect) {
                var _self = this;

                this.element.hide(this.options.hideEffect, this.options.effectOptions, this.options.effectSpeed, function() {
                    _self._postHide();
                });
            }
            else {
                this.element.hide();

                this._postHide();
            }

            if(this.options.modal) {
                this._disableModality();
            }
        },
        
        _postHide: function() {
            //execute user defined callback
            this._trigger('afterHide', null);

            this.element.attr({
                'aria-hidden': true,
                'aria-live': 'off'
            });
            
            if(this.options.responsive) {
                this._unbindResizeListener();
            }
        },

        _applyFocus: function() {
            this.element.find(':not(:submit):not(:button):input:visible:enabled:first').focus();
        },

        _bindEvents: function() {   
            var $this = this;
            this.element.on('mousedown.puidialog', function(e) {
                if(!$(e.target).data('ui-widget-overlay')) { 
                  $this._moveToTop();
                }
             });

            this.icons.mouseover(function() {
                $(this).addClass('ui-state-hover');
            }).mouseout(function() {
                $(this).removeClass('ui-state-hover');
            });

            this.closeIcon.on('click.puidialog', function(e) {
                $this.hide();
                $this._trigger('clickClose');
                e.preventDefault();
            });

            this.maximizeIcon.click(function(e) {
                $this.toggleMaximize();
                e.preventDefault();
            });

            this.minimizeIcon.click(function(e) {
                $this.toggleMinimize();
                e.preventDefault();
            });

            if(this.options.closeOnEscape) {
                $(document).on('keydown.dialog_' + this.id, function(e) {
                    var keyCode = $.ui.keyCode,
                    active = parseInt($this.element.css('z-index'), 10) === PUI.zindex;

                    if(e.which === keyCode.ESCAPE && $this.element.is(':visible') && active) {
                        $this.hide();
                        $this._trigger('hideWithEscape');
                    }
                });
            }
        },

        _unbindEvents: function() {
            this.element.off('mousedown.puidialog');
            this.icons.off();
            $(document).off('keydown.dialog_' + this.id);
        },

        _setupDraggable: function() {    
            this.element.draggable({
                cancel: '.ui-dialog-content, .ui-dialog-titlebar-close',
                handle: '.ui-dialog-titlebar',
                containment : 'document'
            });
        },

        _setupResizable: function() {
            var $this = this;
            
            this.element.resizable({
                minWidth : this.options.minWidth,
                minHeight : this.options.minHeight,
                alsoResize : this.content,
                containment: 'document',
                start: function(event, ui) {
                    $this.element.data('offset', $this.element.offset());
                },
                stop: function(event, ui) {
                    var offset = $this.element.data('offset');

                    $this.element.css('position', 'fixed');
                    $this.element.offset(offset);
                }
            });

            this.resizers = this.element.children('.ui-resizable-handle');
        },

        _initPosition: function() {
            //reset
            this.element.css({left:0,top:0});

            if(/(center|left|top|right|bottom)/.test(this.options.location)) {
                this.options.location = this.options.location.replace(',', ' ');

                this.element.position({
                            my: 'center',
                            at: this.options.location,
                            collision: 'fit',
                            of: window,
                            //make sure dialog stays in viewport
                            using: function(pos) {
                                var l = pos.left < 0 ? 0 : pos.left,
                                t = pos.top < 0 ? 0 : pos.top;

                                $(this).css({
                                    left: l,
                                    top: t
                                });
                            }
                        });
            }
            else {
                var coords = this.options.position.split(','),
                x = $.trim(coords[0]),
                y = $.trim(coords[1]);

                this.element.offset({
                    left: x,
                    top: y
                });
            }

            this.positionInitialized = true;
        },

        _moveToTop: function() {
            this.element.css('z-index',++PUI.zindex);
        },

        toggleMaximize: function() {
            if(this.minimized) {
                this.toggleMinimize();
            }

            if(this.maximized) {
                this.element.removeClass('ui-dialog-maximized');
                this._restoreState();

                this.maximizeIcon.removeClass('ui-state-hover');
                this.maximized = false;
            }
            else {
                this._saveState();

                var win = $(window);

                this.element.addClass('ui-dialog-maximized').css({
                    'width': win.width() - 6,
                    'height': win.height()
                }).offset({
                    top: win.scrollTop(),
                    left: win.scrollLeft()
                });

                //maximize content
                this.content.css({
                    width: 'auto',
                    height: 'auto'
                });

                this.maximizeIcon.removeClass('ui-state-hover');
                this.maximized = true;
                this._trigger('maximize');
            }
        },

        toggleMinimize: function() {
            var animate = true,
            dockingZone = $(document.body).children('.ui-dialog-docking-zone');

            if(this.maximized) {
                this.toggleMaximize();
                animate = false;
            }

            var $this = this;

            if(this.minimized) {
                this.element.appendTo(this.parent).removeClass('ui-dialog-minimized').css({'position':'fixed', 'float':'none'});
                this._restoreState();
                this.content.show();
                this.minimizeIcon.removeClass('ui-state-hover').children('.fa').removeClass('fa-plus').addClass('fa-minus');
                this.minimized = false;

                if(this.options.resizable) {
                    this.resizers.show();
                }
                
                if(this.footer) {
                    this.footer.show();
                }
            }
            else {
                this._saveState();

                if(animate) {
                    this.element.effect('transfer', {
                                    to: dockingZone,
                                    className: 'ui-dialog-minimizing'
                                 }, 500,
                                    function() {
                                        $this._dock(dockingZone);
                                        $this.element.addClass('ui-dialog-minimized');
                                    });
                } 
                else {
                    this._dock(dockingZone);
                }
            }
        },

        _dock: function(zone) {
            this.element.appendTo(zone).css('position', 'static');
            this.element.css({'height':'auto', 'width':'auto', 'float': 'left'});
            this.content.hide();
            this.minimizeIcon.removeClass('ui-state-hover').children('.fa').removeClass('fa-minus').addClass('fa-plus');
            this.minimized = true;

            if(this.options.resizable) {
                this.resizers.hide();
            }
            
            if(this.footer) {
                this.footer.hide();
            }
            
            zone.css('z-index',++PUI.zindex);

            this._trigger('minimize');
        },

        _saveState: function() {
            this.state = {
                width: this.element.width(),
                height: this.element.height()
            };

            var win = $(window);
            this.state.offset = this.element.offset();
            this.state.windowScrollLeft = win.scrollLeft();
            this.state.windowScrollTop = win.scrollTop();
        },

        _restoreState: function() {
            this.element.width(this.state.width).height(this.state.height);
            
            var win = $(window);
            this.element.offset({
                    top: this.state.offset.top + (win.scrollTop() - this.state.windowScrollTop),
                    left: this.state.offset.left + (win.scrollLeft() - this.state.windowScrollLeft)
            });
        },

        _applyARIA: function() {
            this.element.attr({
                'role': 'dialog',
                'aria-labelledby': this.element.attr('id') + '_title',
                'aria-hidden': !this.options.visible
            });

            this.titlebar.children('a.ui-dialog-titlebar-icon').attr('role', 'button');
        },

        _removeARIA: function() {
            this.element.removeAttr('role').removeAttr('aria-labelledby').removeAttr('aria-hidden')
                            .removeAttr('aria-live').removeAttr('aria-hidden');
        },
        
        _bindResizeListener: function() {
            var $this = this;
            $(window).on(this.resizeNS, function(e) {
                if(e.target === window) {
                    $this._initPosition();
                }
            });
        },

        _unbindResizeListener: function() {
            $(window).off(this.resizeNS);
        },

        _setOption: function(key, value) {
            if(key === 'visible') {
                if(value)
                    this.show();
                else
                    this.hide();
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        }
    });
    
}));
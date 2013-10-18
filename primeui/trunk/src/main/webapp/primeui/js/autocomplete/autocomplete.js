/**
 * PrimeUI autocomplete widget
 */
$(function() {

    $.widget("primeui.puiautocomplete", {
       
        options: {
            delay: 300,
            minQueryLength: 1,
            multiple: false,
            dropdown: false,
            scrollHeight: 200,
            forceSelection: false,
            effect:null,
            effectOptions: {},
            effectSpeed: 'normal',
            content: null,
            caseSensitive: false
        },

        _create: function() {
            this.element.puiinputtext();
            this.panel = $('<div class="pui-autocomplete-panel ui-widget-content ui-corner-all ui-helper-hidden pui-shadow"></div>').appendTo('body');
            
            if(this.options.multiple) {
                this.element.wrap('<ul class="pui-autocomplete-multiple ui-widget pui-inputtext ui-state-default ui-corner-all">' + 
                                        '<li class="pui-autocomplete-input-token"></li></ul>');
                this.inputContainer = this.element.parent();
                this.multiContainer = this.inputContainer.parent();
            }
            else {
                if(this.options.dropdown) {
                    this.dropdown = $('<button type="button" class="pui-button ui-widget ui-state-default ui-corner-right pui-button-icon-only">' +
                        '<span class="pui-button-icon-primary ui-icon ui-icon-triangle-1-s"></span><span class="pui-button-text">&nbsp;</span></button>')
                        .insertAfter(this.element);
                    this.element.removeClass('ui-corner-all').addClass('ui-corner-left');
                }
            }

            this._bindEvents();
        },
                
        _bindEvents: function() {
            var $this = this;
 
            this._bindKeyEvents();
            
            if(this.options.dropdown) {
                this.dropdown.on('hover.puiautocomplete', function() {
                    if(!$this.element.prop('disabled')) {
                        $this.dropdown.toggleClass('ui-state-hover');
                    }
                })
                .on('mousedown.puiautocomplete', function() {
                    if(!$this.element.prop('disabled')) {
                        $this.dropdown.addClass('ui-state-active');
                    }
                })
                .on('mouseup.puiautocomplete', function() {
                    if(!$this.element.prop('disabled')) {
                        $this.dropdown.removeClass('ui-state-active');
                        $this.search('');
                        $this.element.focus();
                    }
                })
                .on('focus.puiautocomplete', function() {
                    $this.dropdown.addClass('ui-state-focus');
                })
                .on('blur.puiautocomplete', function() {
                    $this.dropdown.removeClass('ui-state-focus');
                })
                .on('keydown.puiautocomplete', function(e) {
                    var keyCode = $.ui.keyCode;

                    if(e.which == keyCode.ENTER || e.which == keyCode.NUMPAD_ENTER) {
                        $this.search('');
                        $this.input.focus();

                        e.preventDefault();
                    }
                });
            }
            
            if(this.options.multiple) {
                this.multiContainer.on('hover.puiautocomplete', function() {
                    $(this).toggleClass('ui-state-hover');
                })
                .on('click.puiautocomplete', function() {
                    $this.element.trigger('focus');
                });

                this.element.on('focus.pui-autocomplete', function() {
                    $this.multiContainer.addClass('ui-state-focus');
                })
                .on('blur.pui-autocomplete', function(e) {
                    $this.multiContainer.removeClass('ui-state-focus');
                });
            }
            
            if(this.options.forceSelection) {
                this.currentItems = [this.element.val()];

                this.element.on('blur.puiautocomplete', function() {
                    var value = $(this).val(),
                    valid = false;
                    
                    for(var i = 0; i < $this.currentItems.length; i++) {
                        if($this.currentItems[i] === value) {
                            valid = true;
                            break;
                        }
                    }

                    if(!valid) {
                        $this.element.val('');
                    }
                });
            }

            $(document.body).bind('mousedown.puiautocomplete', function (e) {
                if($this.panel.is(":hidden")) {
                    return;
                }
                
                if(e.target === $this.element.get(0)) {
                    return;
                }
                
                var offset = $this.panel.offset();
                if (e.pageX < offset.left ||
                    e.pageX > offset.left + $this.panel.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.panel.height()) {
                    $this.hide();
                }
            });

            $(window).bind('resize.' + this.element.id, function() {
                if($this.panel.is(':visible')) {
                    $this._alignPanel();
                }
            });
        },
        
        _bindKeyEvents: function() {
            var $this = this;

            this.element.on('keyup.puiautocomplete', function(e) {
                var keyCode = $.ui.keyCode,
                key = e.which,
                shouldSearch = true;

                if(key == keyCode.UP ||
                    key == keyCode.LEFT ||
                    key == keyCode.DOWN ||
                    key == keyCode.RIGHT ||
                    key == keyCode.TAB ||
                    key == keyCode.SHIFT ||
                    key == keyCode.ENTER ||
                    key == keyCode.NUMPAD_ENTER) {
                    shouldSearch = false;
                } 

                if(shouldSearch) {
                    var value = $this.element.val();

                    if(!value.length) {
                        $this.hide();
                    }

                    if(value.length >= $this.options.minQueryLength) {
                        if($this.timeout) {
                            window.clearTimeout($this.timeout);
                        }

                        $this.timeout = window.setTimeout(function() {
                            $this.search(value);
                        }, 
                        $this.options.delay);
                    }
                }

            }).on('keydown.puiautocomplete', function(e) {
                if($this.panel.is(':visible')) {
                    var keyCode = $.ui.keyCode,
                    highlightedItem = $this.items.filter('.ui-state-highlight');

                    switch(e.which) {
                        case keyCode.UP:
                        case keyCode.LEFT:
                            var prev = highlightedItem.prev();

                            if(prev.length == 1) {
                                highlightedItem.removeClass('ui-state-highlight');
                                prev.addClass('ui-state-highlight');

                                if($this.options.scrollHeight) {
                                    PUI.scrollInView($this.panel, prev);
                                }
                            }

                            e.preventDefault();
                            break;

                        case keyCode.DOWN:
                        case keyCode.RIGHT:
                            var next = highlightedItem.next();

                            if(next.length == 1) {
                                highlightedItem.removeClass('ui-state-highlight');
                                next.addClass('ui-state-highlight');

                                if($this.options.scrollHeight) {
                                    PUI.scrollInView($this.panel, next);
                                }
                            }

                            e.preventDefault();
                            break;

                        case keyCode.ENTER:
                        case keyCode.NUMPAD_ENTER:
                            highlightedItem.trigger('click');

                            e.preventDefault();
                            break;

                        case keyCode.ALT: 
                        case 224:
                            break;

                        case keyCode.TAB:
                            highlightedItem.trigger('click');
                            $this.hide();
                            break;
                    }
                }

            });
        },

        _bindDynamicEvents: function() {
            var $this = this;

            this.items.on('mouseover.puiautocomplete', function() {
                var item = $(this);

                if(!item.hasClass('ui-state-highlight')) {
                    $this.items.filter('.ui-state-highlight').removeClass('ui-state-highlight');
                    item.addClass('ui-state-highlight');
                }
            })
            .on('click.puiautocomplete', function(event) {
                var item = $(this);
                
                if($this.options.multiple) {
                    var tokenMarkup = '<li class="pui-autocomplete-token ui-state-active ui-corner-all ui-helper-hidden">';
                    tokenMarkup += '<span class="pui-autocomplete-token-icon ui-icon ui-icon-close" />';
                    tokenMarkup += '<span class="pui-autocomplete-token-label">' + item.data('label') + '</span></li>';

                    $(tokenMarkup).data(item.data())
                        .insertBefore($this.inputContainer).fadeIn()
                        .children('.pui-autocomplete-token-icon').on('click.pui-autocomplete', function(e) {
                            var token = $(this).parent();
                            $this._removeItem(token);
                            $this._trigger('unselect', e, token);
                    });
                    
                    $this.element.val('').trigger('focus');
                }
                else {
                    $this.element.val(item.data('label')).focus();
                }

                $this._trigger('select', event, item);
                $this.hide();
            });
        },
        
        search: function(q) {            
            this.query = this.options.caseSensitive ? q : q.toLowerCase();

            var request = {
                query: this.query
            };

            if(this.options.completeSource) {
                if($.isArray(this.options.completeSource)) {
                    var sourceArr = this.options.completeSource,
                    data = [],
                    emptyQuery = ($.trim(q) === '');
                    
                    for(var i = 0 ; i < sourceArr.length; i++) {
                        var item = sourceArr[i],
                        itemLabel = item.label||item;
                        
                        if(!this.options.caseSensitive) {
                            itemLabel = itemLabel.toLowerCase();
                        }

                        if(emptyQuery||itemLabel.indexOf(this.query) === 0) {
                            data.push({label:sourceArr[i], value: item});
                        }
                    }

                    this._handleData(data);
                }
                else {
                    this.options.completeSource.call(this, request, this._handleData);
                }
            }
        },

        _handleData: function(data) {
            var $this = this;
            this.panel.html('');
            this.listContainer = $('<ul class="pui-autocomplete-items pui-autocomplete-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>').appendTo(this.panel);

            for(var i = 0; i < data.length; i++) {
                var item = $('<li class="pui-autocomplete-item pui-autocomplete-list-item ui-corner-all"></li>');
                item.data(data[i]);
                
                if(this.options.content)
                    item.html(this.options.content.call(this, data[i]));
                else
                    item.text(data[i].label);
                
                this.listContainer.append(item);
            }
            
            this.items = this.listContainer.children('.pui-autocomplete-item');
            
            this._bindDynamicEvents();

            if(this.items.length > 0) {
                var firstItem = $this.items.eq(0),
                hidden = this.panel.is(':hidden');
                firstItem.addClass('ui-state-highlight');

                if($this.query.length > 0 && !$this.options.content) {
                    $this.items.each(function() {
                        var item = $(this),
                        text = item.html(),
                        re = new RegExp(PUI.escapeRegExp($this.query), 'gi'),
                        highlighedText = text.replace(re, '<span class="pui-autocomplete-query">$&</span>');

                        item.html(highlighedText);
                    });
                }

                if(this.options.forceSelection) {
                    this.currentItems = [];
                    $.each(data, function(i, item) {
                        $this.currentItems.push(item.label);
                    });
                }

                //adjust height
                if($this.options.scrollHeight) {
                    var heightConstraint = hidden ? $this.panel.height() : $this.panel.children().height();

                    if(heightConstraint > $this.options.scrollHeight)
                        $this.panel.height($this.options.scrollHeight);
                    else
                        $this.panel.css('height', 'auto');                              

                }

                if(hidden) {
                    $this.show();
                }
                else {
                    $this._alignPanel();
                }
            }
            else {
                this.panel.hide();
            }
        },

        show: function() {
            this._alignPanel();

            if(this.options.effect)
                this.panel.show(this.options.effect, {}, this.options.effectSpeed);
            else
                this.panel.show();
        },

        hide: function() {        
            this.panel.hide();
            this.panel.css('height', 'auto');
        },
        
        _removeItem: function(item) {
            item.fadeOut('fast', function() {
                var token = $(this);

                token.remove();
            });
        },
        
        _alignPanel: function() {
            var panelWidth = null;

            if(this.options.multiple) {
                panelWidth = this.multiContainer.innerWidth() - (this.element.position().left - this.multiContainer.position().left);
            }
            else {
                if(this.panel.is(':visible')) {
                    panelWidth = this.panel.children('.pui-autocomplete-items').outerWidth();
                }
                else {
                    this.panel.css({'visibility':'hidden','display':'block'});
                    panelWidth = this.panel.children('.pui-autocomplete-items').outerWidth();
                    this.panel.css({'visibility':'visible','display':'none'});
                }

                var inputWidth = this.element.outerWidth();
                if(panelWidth < inputWidth) {
                    panelWidth = inputWidth;
                }
            }

            this.panel.css({
                            'left':'',
                            'top':'',
                            'width': panelWidth,
                            'z-index': ++PUI.zindex
                    })
                    .position({
                        my: 'left top',
                        at: 'left bottom',
                        of: this.element
                    });
        }
    });
    
});
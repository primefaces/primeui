/**
 * PrimeUI inputtextarea widget
 */
$(function() {

    $.widget("primeui.puiinputtextarea", {
       
        options: {
            autoResize: false,
            autoComplete: false,
            maxlength: null,
            counter: null,
            counterTemplate: '{0}',
            minQueryLength: 3,
            queryDelay: 700
        },

        _create: function() {
            var $this = this;
            
            this.element.puiinputtext();
            
            if(this.options.autoResize) {
                this.options.rowsDefault = this.element.attr('rows');
                this.options.colsDefault = this.element.attr('cols');
        
                this.element.addClass('pui-inputtextarea-resizable');
                
                this.element.keyup(function() {
                    $this._resize();
                }).focus(function() {
                    $this._resize();
                }).blur(function() {
                    $this._resize();
                });
            }
            
            if(this.options.maxlength) {
                this.element.keyup(function(e) {
                    var value = $this.element.val(),
                    length = value.length;

                    if(length > $this.options.maxlength) {
                        $this.element.val(value.substr(0, $this.options.maxlength));
                    }

                    if($this.options.counter) {
                        $this._updateCounter();
                    }
                });
            }
            
            if(this.options.counter) {
                this._updateCounter();
            }
            
            if(this.options.autoComplete) {
                this._initAutoComplete();
            }
        },
        
        _updateCounter: function() {
            var value = this.element.val(),
            length = value.length;

            if(this.options.counter) {
                var remaining = this.options.maxlength - length,
                remainingText = this.options.counterTemplate.replace('{0}', remaining);

                this.options.counter.text(remainingText);
            }
        },
        
        _resize: function() {
            var linesCount = 0,
            lines = this.element.val().split('\n');

            for(var i = lines.length-1; i >= 0 ; --i) {
                linesCount += Math.floor((lines[i].length / this.options.colsDefault) + 1);
            }

            var newRows = (linesCount >= this.options.rowsDefault) ? (linesCount + 1) : this.options.rowsDefault;

            this.element.attr('rows', newRows);
        },
        
        
        _initAutoComplete: function() {
            var panelMarkup = '<div id="' + this.id + '_panel" class="pui-autocomplete-panel ui-widget-content ui-corner-all ui-helper-hidden ui-shadow"></div>',
            $this = this;

            this.panel = $(panelMarkup).appendTo(document.body);

            this.element.keyup(function(e) {
                var keyCode = $.ui.keyCode;

                switch(e.which) {

                    case keyCode.UP:
                    case keyCode.LEFT:
                    case keyCode.DOWN:
                    case keyCode.RIGHT:
                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                    case keyCode.TAB:
                    case keyCode.SPACE:
                    case keyCode.CONTROL:
                    case keyCode.ALT:
                    case keyCode.ESCAPE:
                    case 224:   //mac command
                        //do not search
                    break;

                    default:
                        var query = $this._extractQuery();           
                        if(query && query.length >= $this.options.minQueryLength) {

                             //Cancel the search request if user types within the timeout
                            if($this.timeout) {
                                $this._clearTimeout($this.timeout);
                            }

                            $this.timeout = window.setTimeout(function() {
                                $this.search(query);
                            }, $this.options.queryDelay);

                        }
                    break;
                }

            }).keydown(function(e) {
                var overlayVisible = $this.panel.is(':visible'),
                    keyCode = $.ui.keyCode,
                    highlightedItem;

                switch(e.which) {
                    case keyCode.UP:
                    case keyCode.LEFT:
                        if(overlayVisible) {
                            highlightedItem = $this.items.filter('.ui-state-highlight');
                            var prev = highlightedItem.length === 0 ? $this.items.eq(0) : highlightedItem.prev();

                            if(prev.length == 1) {
                                highlightedItem.removeClass('ui-state-highlight');
                                prev.addClass('ui-state-highlight');

                                if($this.options.scrollHeight) {
                                    PUI.scrollInView($this.panel, prev);
                                }
                            }

                            e.preventDefault();
                        }
                        else {
                            $this._clearTimeout();
                        }
                    break;

                    case keyCode.DOWN:
                    case keyCode.RIGHT:
                        if(overlayVisible) {
                            highlightedItem = $this.items.filter('.ui-state-highlight');
                            var next = highlightedItem.length === 0 ? _self.items.eq(0) : highlightedItem.next();

                            if(next.length == 1) {
                                highlightedItem.removeClass('ui-state-highlight');
                                next.addClass('ui-state-highlight');

                                if($this.options.scrollHeight) {
                                    PUI.scrollInView($this.panel, next);
                                }
                            }

                            e.preventDefault();
                        }
                        else {
                            $this._clearTimeout();
                        }
                    break;

                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        if(overlayVisible) {
                            $this.items.filter('.ui-state-highlight').trigger('click');

                            e.preventDefault();
                        }
                        else {
                            $this._clearTimeout();
                        } 
                    break;

                    case keyCode.SPACE:
                    case keyCode.CONTROL:
                    case keyCode.ALT:
                    case keyCode.BACKSPACE:
                    case keyCode.ESCAPE:
                    case 224:   //mac command
                        $this._clearTimeout();

                        if(overlayVisible) {
                            $this._hide();
                        }
                    break;

                    case keyCode.TAB:
                        $this._clearTimeout();

                        if(overlayVisible) {
                            $this.items.filter('.ui-state-highlight').trigger('click');
                            $this._hide();
                        }
                    break;
                }
            });

            //hide panel when outside is clicked
            $(document.body).bind('mousedown.puiinputtextarea', function (e) {
                if($this.panel.is(":hidden")) {
                    return;
                }
                var offset = $this.panel.offset();
                if(e.target === $this.element.get(0)) {
                    return;
                }

                if (e.pageX < offset.left ||
                    e.pageX > offset.left + $this.panel.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.panel.height()) {
                    $this._hide();
                }
            });

            //Hide overlay on resize
            var resizeNS = 'resize.' + this.id;
            $(window).unbind(resizeNS).bind(resizeNS, function() {
                if($this.panel.is(':visible')) {
                    $this._hide();
                }
            });
        },

        _bindDynamicEvents: function() {
            var $this = this;

            //visuals and click handler for items
            this.items.bind('mouseover', function() {
                var item = $(this);

                if(!item.hasClass('ui-state-highlight')) {
                    $this.items.filter('.ui-state-highlight').removeClass('ui-state-highlight');
                    item.addClass('ui-state-highlight');
                }
            })
            .bind('click', function(event) {
                var item = $(this),
                itemValue = item.attr('data-item-value'),
                insertValue = itemValue.substring($this.query.length);

                $this.element.focus();

                $this.element.insertText(insertValue, $this.element.getSelection().start, true);

                $this._hide();
                
                $this._trigger("itemselect", event, item);
            });
        },

        _clearTimeout: function() {
            if(this.timeout) {
                window.clearTimeout(this.timeout);
            }

            this.timeout = null;
        },

        _extractQuery: function() {
            var end = this.element.getSelection().end,
            result = /\S+$/.exec(this.element.get(0).value.slice(0, end)),
            lastWord = result ? result[0] : null;

            return lastWord;
        },

        search: function(q) {
            this.query = q;

            var request = {
                query: q 
            };

            if(this.options.completeSource) {
                this.options.completeSource.call(this, request, this._handleResponse);
            }
        },

        _handleResponse: function(data) {
            this.panel.html('');

            var listContainer = $('<ul class="pui-autocomplete-items pui-autocomplete-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>');

            for(var i = 0; i < data.length; i++) {
                var item = $('<li class="pui-autocomplete-item pui-autocomplete-list-item ui-corner-all"></li>');
                item.attr('data-item-value', data[i].value);
                item.text(data[i].label);

                listContainer.append(item);
            }

            this.panel.append(listContainer).show();
            this.items = this.panel.find('.pui-autocomplete-item');

            this._bindDynamicEvents();

            if(this.items.length > 0) {                            
                //highlight first item
                this.items.eq(0).addClass('ui-state-highlight');

                //adjust height
                if(this.options.scrollHeight && this.panel.height() > this.options.scrollHeight) {
                    this.panel.height(this.options.scrollHeight);
                }

                if(this.panel.is(':hidden')) {
                    this._show();
                } 
                else {
                    this._alignPanel(); //with new items
                }

            }
            else {
                this.panel.hide();
            }
        },

        _alignPanel: function() {
            var pos = this.element.getCaretPosition(),
            offset = this.element.offset();

            this.panel.css({
                            'left': offset.left + pos.left,
                            'top': offset.top + pos.top,
                            'width': this.element.innerWidth()
                    });
        },

        _show: function() {
            this._alignPanel();

            this.panel.show();
        },

        _hide: function() {        
            this.panel.hide();
        },

        disable: function () {
            this.element.puiinputtext('disable');
        },

        enable: function () {
            this.element.puiinputtext('enable');
        }
    });
    
});
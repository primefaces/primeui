/**
 * PrimeUI picklist widget
 */
(function() {

    $.widget("primeui.puiorderlist", {
       
        options: {
            controlsLocation: 'none',
            dragdrop: true,
            effect: 'fade',
            caption: null,
            responsive: false,
            datasource: null,
            content: null
        },

        _create: function() {
            this._createDom();
            
            if(this.options.datasource) {
                if($.isArray(this.options.datasource)) {
                    this._generateOptionElements(this.options.datasource);
                }
                else if($.type(this.options.datasource) === 'function') {
                    this.options.datasource.call(this, this._generateOptionElements);
                }
            }
            
            this.optionElements = this.element.children('option');
            this._createListElement();

            this._bindEvents();
        },
        
        _createDom: function() {
            this.element.addClass('ui-helper-hidden');
            if(this.options.controlsLocation !== 'none')
                this.element.wrap('<div class="pui-grid-col-10"></div>');
            else
                this.element.wrap('<div class="pui-grid-col-12"></div>');

            this.element.parent().wrap('<div class="pui-orderlist pui-grid ui-widget"><div class="pui-grid-row"></div></div>')
            this.container = this.element.closest('.pui-orderlist');
            
            if(this.options.controlsLocation !== 'none') {
                this.element.parent().before('<div class="pui-orderlist-controls pui-grid-col-2"></div>');
                this._createButtons();
            }
            
            if(this.options.responsive) {
                this.container.addClass('pui-grid-responsive');
            }
        },
        
        _generateOptionElements: function(data) {
            for(var i = 0; i < data.length; i++) {
                var choice = data[i];
                if(choice.label)
                    this.element.append('<option value="' + choice.value + '">' + choice.label + '</option>');
                else
                    this.element.append('<option value="' + choice + '">' + choice + '</option>');
            }
        },
        
        _createListElement: function() {
            this.list = $('<ul class="ui-widget-content pui-orderlist-list"></ul>').insertBefore(this.element);
                    
            for(var i = 0; i < this.optionElements.length; i++) {
                var optionElement = this.optionElements.eq(i),
                itemContent = this.options.content ? this.options.content.call(this, optionElement) : optionElement.text(),
                listItem = $('<li class="pui-orderlist-item ui-corner-all"></li>');
        
                if($.type(itemContent) === 'string')
                    listItem.html(itemContent);
                else
                    listItem.append(itemContent);
        
                listItem.data('item-value', optionElement.attr('value')).appendTo(this.list);
            }
            
            this.items = this.list.children('.pui-orderlist-item');
            
            if(this.options.caption) {
                this.list.addClass('ui-corner-bottom').before('<div class="pui-orderlist-caption ui-widget-header ui-corner-top">' + this.options.caption + '</div>')
            } else {
                this.list.addClass('ui-corner-all')
            }
        },
        
        _createButtons: function() {
            var $this = this,
            buttonContainer = this.element.parent().prev();
            
            buttonContainer.append(this._createButton('fa-angle-up', 'pui-orderlist-button-moveup', function(){$this._moveUp();}))
                            .append(this._createButton('fa-angle-double-up', 'pui-orderlist-button-move-top', function(){$this._moveTop();}))
                            .append(this._createButton('fa-angle-down', 'pui-orderlist-button-move-down', function(){$this._moveDown();}))
                            .append(this._createButton('fa-angle-double-down', 'pui-orderlist-move-bottom', function(){$this._moveBottom();}));
        },
        
        _createButton: function(icon, cssClass, fn) {
            var btn = $('<button class="' + cssClass + '" type="button"></button>').puibutton({
                'icon': icon,
                'click': function() {
                    fn();
                    $(this).removeClass('ui-state-hover ui-state-focus');
                }
            });
            
            return btn;
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.items.on('mouseover.puiorderlist', function(e) {
                var element = $(this);

                if(!element.hasClass('ui-state-highlight'))
                    $(this).addClass('ui-state-hover');
            })
            .on('mouseout.puiorderlist', function(e) {
                var element = $(this);

                if(!element.hasClass('ui-state-highlight'))
                    $(this).removeClass('ui-state-hover');
            })
            .on('mousedown.puiorderlist', function(e) {
                var element = $(this),
                metaKey = (e.metaKey||e.ctrlKey);

                if(!metaKey) {
                    element.removeClass('ui-state-hover').addClass('ui-state-highlight')
                            .siblings('.ui-state-highlight').removeClass('ui-state-highlight');

                    //$this.fireItemSelectEvent(element, e);
                }
                else {
                    if(element.hasClass('ui-state-highlight')) {
                        element.removeClass('ui-state-highlight');
                        //$this.fireItemUnselectEvent(element);
                    }
                    else {
                        element.removeClass('ui-state-hover').addClass('ui-state-highlight');
                        //$this.fireItemSelectEvent(element, e);
                    }
                }
            });

            if(this.options.dragdrop) {
                this.list.sortable({
                    revert: 1,
                    start: function(event, ui) {
                        //PrimeFaces.clearSelection();
                    }
                    ,update: function(event, ui) {
                        $this.onDragDrop(event, ui);
                    }
                });
            }
        },
        
        _moveUp: function() {
            var $this = this,
            selectedItems = this.items.filter('.ui-state-highlight'),
            itemsToMoveCount = selectedItems.length,
            movedItemsCount = 0;

            selectedItems.each(function() {
                var item = $(this);

                if(!item.is(':first-child')) {
                    item.hide($this.options.effect, {}, 'fast', function() {
                        item.insertBefore(item.prev()).show($this.options.effect, {}, 'fast', function() {
                            movedItemsCount++;

                            if(itemsToMoveCount === movedItemsCount) {
                                $this._saveState();
                                $this._fireReorderEvent();
                            }
                        });
                    });
                }
                else {
                    itemsToMoveCount--;
                }
            });
        },

        _moveTop: function() {
            var $this = this,
            selectedItems = this.items.filter('.ui-state-highlight'),
            itemsToMoveCount = selectedItems.length,
            movedItemsCount = 0;

            selectedItems.each(function() {
                var item = $(this);

                if(!item.is(':first-child')) {
                    item.hide($this.options.effect, {}, 'fast', function() {
                        item.prependTo(item.parent()).show($this.options.effect, {}, 'fast', function(){
                            movedItemsCount++;

                            if(itemsToMoveCount === movedItemsCount) {
                                $this._saveState();
                                $this._fireReorderEvent();
                            }
                        });
                    });
                }
                else {
                    itemsToMoveCount--;
                }
            });
        },

        _moveDown: function() {
            var $this = this,
            selectedItems = $(this.items.filter('.ui-state-highlight').get().reverse()),
            itemsToMoveCount = selectedItems.length,
            movedItemsCount = 0;

            selectedItems.each(function() {
                var item = $(this);

                if(!item.is(':last-child')) {                
                    item.hide($this.options.effect, {}, 'fast', function() {
                        item.insertAfter(item.next()).show($this.options.effect, {}, 'fast', function() {
                            movedItemsCount++;

                            if(itemsToMoveCount === movedItemsCount) {
                                $this._saveState();
                                $this._fireReorderEvent();
                            }
                        });
                    });
                }
                else {
                    itemsToMoveCount--;
                }
            });
        },

        _moveBottom: function() {
            var $this = this,
            selectedItems = this.items.filter('.ui-state-highlight'),
            itemsToMoveCount = selectedItems.length,
            movedItemsCount = 0;

            selectedItems.each(function() {
                var item = $(this);

                if(!item.is(':last-child')) {
                    item.hide($this.options.effect, {}, 'fast', function() {
                        item.appendTo(item.parent()).show($this.options.effect, {}, 'fast', function() {
                            movedItemsCount++;

                            if(itemsToMoveCount === movedItemsCount) {
                                $this._saveState();
                                $this._fireReorderEvent();
                            }
                        });
                    });
                }
                else {
                    itemsToMoveCount--;
                }
            });
        },
        
        _saveState: function() {
            this.element.children().remove();
            this._generateOptions();
        },
        
        _fireReorderEvent: function() {
            this._trigger('reorder', null);
        },
        
        onDragDrop: function(event, ui) {
            ui.item.removeClass('ui-state-highlight');
            this._saveState();
            this._fireReorderEvent();
        },
        
        _generateOptions: function() {
            var $this = this;

            this.list.children('.pui-orderlist-item').each(function() {
                var item = $(this),
                itemValue = item.data('item-value');

                $this.element.append('<option value="' + itemValue + '" selected="selected">' + itemValue + '</option>');
            });
        }
        
    });
        
})();
/**
 * PrimeUI picklist widget
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

    $.widget("primeui.puiorderlist", {
       
        options: {
            controlsLocation: 'none',
            dragdrop: true,
            effect: 'fade',
            caption: null,
            responsive: false,
            datasource: null,
            content: null,
            template: null
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
                this.element.wrap('<div class="ui-grid-col-10"></div>');
            else
                this.element.wrap('<div class="ui-grid-col-12"></div>');

            this.element.parent().wrap('<div class="ui-orderlist ui-grid ui-widget"><div class="ui-grid-row"></div></div>')
            this.container = this.element.closest('.ui-orderlist');
            
            if(this.options.controlsLocation !== 'none') {
                this.element.parent().before('<div class="ui-orderlist-controls ui-grid-col-2"></div>');
                this._createButtons();
            }
            
            if(this.options.responsive) {
                this.container.addClass('ui-grid-responsive');
            }
        },
        
        _generateOptionElements: function(data) {
            for(var i = 0; i < data.length; i++) {
                var choice = data[i];
                if(choice.label)
                    this.element.append('<option value="' + choice.value + '">' + choice.label + '</option>');
                else
                    this.element.append('<option value="' + choice + '">' + choice + '</option>');
            }
        },
        
        _createListElement: function() {
            this.list = $('<ul class="ui-widget-content ui-orderlist-list"></ul>').insertBefore(this.element);
                    
            for(var i = 0; i < this.optionElements.length; i++) {
                var optionElement = this.optionElements.eq(i),
                itemContent = this._createItemContent(optionElement.get(0)),
                listItem = $('<li class="ui-orderlist-item ui-corner-all"></li>');
        
                if($.type(itemContent) === 'string')
                    listItem.html(itemContent);
                else
                    listItem.append(itemContent);
        
                listItem.data('item-value', optionElement.attr('value')).appendTo(this.list);
            }
            
            this.items = this.list.children('.ui-orderlist-item');
            
            if(this.options.caption) {
                this.list.addClass('ui-corner-bottom').before('<div class="ui-orderlist-caption ui-widget-header ui-corner-top">' + this.options.caption + '</div>')
            } else {
                this.list.addClass('ui-corner-all')
            }
        },
        
        _createButtons: function() {
            var $this = this;
            this.buttonContainer = this.element.parent().prev();
            this.moveUpButton = this._createButton('fa-angle-up', 'ui-orderlist-button-moveup', function(){$this._moveUp();});
            this.moveTopButton = this._createButton('fa-angle-double-up', 'ui-orderlist-button-move-top', function(){$this._moveTop();});
            this.moveDownButton = this._createButton('fa-angle-down', 'ui-orderlist-button-move-down', function(){$this._moveDown();});
            this.moveBottomButton = this._createButton('fa-angle-double-down', 'ui-orderlist-move-bottom', function(){$this._moveBottom();});

            this.buttonContainer.append(this.moveUpButton).append(this.moveTopButton).append(this.moveDownButton).append(this.moveBottomButton);
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
            this._bindButtonEvents();
            this._bindItemEvents(this.items);

            if(this.options.dragdrop) {
                this._initDragDrop();
            }
        },

        _initDragDrop: function() {
            var $this = this;

            this.list.sortable({
                revert: 1,
                start: function(event, ui) {
                    PUI.clearSelection();
                }
                ,update: function(event, ui) {
                    $this.onDragDrop(event, ui);
                }
            });
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

            this.list.children('.ui-orderlist-item').each(function() {
                var item = $(this),
                itemValue = item.data('item-value');

                $this.element.append('<option value="' + itemValue + '" selected="selected">' + itemValue + '</option>');
            });
        },
        
        _createItemContent: function(choice) {
            if(this.options.template) {
                var template = this.options.template.html();
                Mustache.parse(template);
                return Mustache.render(template, choice);
            }
            else if(this.options.content) {
                return this.options.content.call(this, choice);
            }
            else {
                return choice.label;
            }
        },

        addOption: function(value,label) {
            var newListItem;

            if(this.options.content) {
                var option = (label) ? {'label':label,'value':value}: {'label':value,'value':value};
                newListItem = $('<li class="ui-orderlist-item ui-corner-all"></li>').append(this.options.content(option)).appendTo(this.list);
            }
            else {
                var listLabel = (label) ? label: value;
                newListItem = $('<li class="ui-orderlist-item ui-corner-all">' + listLabel + '</li>').appendTo(this.list);
            }

            if(label)
                this.element.append('<option value="' + value + '">' + label + '</option>');
            else
                this.element.append('<option value="' + value + '">' + value + '</option>');

            this._bindItemEvents(newListItem);

            this.optionElements = this.element.children('option');
            this.items = this.items.add(newListItem);

            if(this.options.dragdrop) {
                this.list.sortable('refresh');
            }
        },

        removeOption: function(value) {
            for (var i = 0; i < this.optionElements.length; i++) {
                if(this.optionElements[i].value == value) {
                    this.optionElements[i].remove(i);
                    this._unbindItemEvents(this.items.eq(i));
                    this.items[i].remove(i);
                }
            }

            this.optionElements = this.element.children('option');
            this.items = this.list.children('.ui-orderlist-item');

            if(this.options.dragdrop) {
                this.list.sortable('refresh');
            }
        },

        _unbindEvents: function() {
            this._unbindItemEvents(this.items);
            this._unbindButtonEvents();
        },

        _unbindItemEvents: function(item) {
            item.off('mouseover.puiorderlist mouseout.puiorderlist mousedown.puiorderlist');
        },

        _bindItemEvents: function(item) {
            var $this = this;

            item.on('mouseover.puiorderlist', function(e) {
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
        },

        getSelection: function() {
            var selectedItems = [];
            this.items.filter('.ui-state-highlight').each(function() {
                selectedItems.push($(this).data('item-value'));
            });
            return selectedItems;
        },

        setSelection: function(value) {
            for (var i = 0; i < this.items.length; i++) {
                for (var j = 0; j < value.length; j++) {
                    if(this.items.eq(i).data('item-value') == value[j]) {
                        this.items.eq(i).addClass('ui-state-highlight');
                    }  
                }
            }
        },

        disable: function() {
            this._unbindEvents();
            this.items.addClass('ui-state-disabled');
            this.container.addClass('ui-state-disabled');

            if(this.options.dragdrop) {
                this.list.sortable('destroy');
            }
        },

        enable: function() {
            this._bindEvents();
            this.items.removeClass('ui-state-disabled');
            this.container.removeClass('ui-state-disabled');

            if(this.options.dragdrop) {
                this._initDragDrop();
            }
        },

        _unbindButtonEvents: function() {
            if(this.buttonContainer) {
                this.moveUpButton.puibutton('disable');
                this.moveTopButton.puibutton('disable');
                this.moveDownButton.puibutton('disable');
                this.moveBottomButton.puibutton('disable');
            }
        },

        _bindButtonEvents: function() {
            if(this.buttonContainer) {
                this.moveUpButton.puibutton('enable');
                this.moveTopButton.puibutton('enable');
                this.moveDownButton.puibutton('enable');
                this.moveBottomButton.puibutton('enable');
            }
        }
        
    });
        
}));
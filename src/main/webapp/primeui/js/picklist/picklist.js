/**
 * PrimeUI picklist widget
 */
$(function() {

    $.widget("primeui.puipicklist", {
       
        options: {
            effect: 'fade',
            effectSpeed: 'fast',
            filter: false
        },

        _create: function() {
            this.element.addClass('pui-picklist ui-widget ui-helper-clearfix');
            this.inputs = this.element.children('select');
            this.items = $();
            this.sourceInput = this.inputs.eq(0);
            this.targetInput = this.inputs.eq(1);
                        
            this.sourceList = this._createList(this.sourceInput);
            this._createButtons();
            this.targetList = this._createList(this.targetInput);
            
            if(this.options.showSourceControls) {
                this.element.prepend(this._createListControls(this.sourceList));
            }
            
            if(this.options.showTargetControls) {
                this.element.append(this._createListControls(this.targetList));
            }
            
            this._bindEvents();
        },
                
        _createList: function(input, cssClass) {
            input.wrap('<div class="ui-helper-hidden"></div>');
            
            var listContainer = $('<ul class="ui-widget-content pui-picklist-list pui-inputtext ui-corner-all ' + cssClass + '"></ul>'),
            options = input.children('option');
    
            for(var i = 0; i < options.length; i++) {
                var option = options.eq(i),
                item = $('<li class="pui-picklist-item ui-corner-all">' + option.text() + '</li>').data({
                    'item-label': option.text(),
                    'item-value': option.val()
                });
        
                this.items = this.items.add(item);
                listContainer.append(item);
            }
            
            this.element.append(listContainer);
            
            return listContainer;
        },
                
        _createButtons: function() {
            var $this = this,
            buttonContainer = $('<ul class="pui-picklist-buttons"></ul>');
            
            buttonContainer.append(this._createButton('ui-icon-arrow-1-e', 'pui-picklist-button-add', function(){$this._add();}))
                            .append(this._createButton('ui-icon-arrowstop-1-e', 'pui-picklist-button-addall', function(){$this._addAll();}))
                            .append(this._createButton('ui-icon-arrow-1-w', 'pui-picklist-button-remove', function(){$this._remove();}))
                            .append(this._createButton('ui-icon-arrowstop-1-w', 'pui-picklist-button-removeall', function(){$this._removeAll();}));
                    
            this.element.append(buttonContainer);
        },
                
        _createListControls: function(list) {
            var $this = this,
            buttonContainer = $('<ul class="pui-picklist-buttons"></ul>');
            
            buttonContainer.append(this._createButton('ui-icon-arrow-1-n', 'pui-picklist-button-move-up', function(){$this._moveUp(list);}))
                            .append(this._createButton('ui-icon-arrowstop-1-n', 'pui-picklist-button-move-top', function(){$this._moveTop(list);}))
                            .append(this._createButton('ui-icon-arrow-1-s', 'pui-picklist-button-move-down', function(){$this._moveDown(list);}))
                            .append(this._createButton('ui-icon-arrowstop-1-s', 'pui-picklist-button-move-bottom', function(){$this._moveBottom(list);}));
                    
            return buttonContainer;
        },
                
        _createButton: function(icon, cssClass, fn) {
            var btn = $('<button class="' + cssClass + '" type="button"></button>').puibutton({
                'icon': icon,
                'click': fn
            });
            
            return btn;
        },
                
        _bindEvents: function() {
            var $this = this;
        
            this.items.on('mouseover.puipicklist', function(e) {
                var element = $(this);

                if(!element.hasClass('ui-state-highlight')) {
                    $(this).addClass('ui-state-hover');
                }
            })
            .on('mouseout.puipicklist', function(e) {
                $(this).removeClass('ui-state-hover');
            })
            .on('click.puipicklist', function(e) {
                var item = $(this),
                metaKey = (e.metaKey||e.ctrlKey);

                if(!e.shiftKey) {
                    if(!metaKey) {
                        $this.unselectAll();
                    }

                    if(metaKey && item.hasClass('ui-state-highlight')) {
                        $this.unselectItem(item);
                    } 
                    else {
                        $this.selectItem(item);
                        $this.cursorItem = item;
                    }
                }
                else {
                    $this.unselectAll();

                    if($this.cursorItem && ($this.cursorItem.parent().is(item.parent()))) {
                        var currentItemIndex = item.index(),
                        cursorItemIndex = $this.cursorItem.index(),
                        startIndex = (currentItemIndex > cursorItemIndex) ? cursorItemIndex : currentItemIndex,
                        endIndex = (currentItemIndex > cursorItemIndex) ? (currentItemIndex + 1) : (cursorItemIndex + 1),
                        parentList = item.parent();

                        for(var i = startIndex ; i < endIndex; i++) {
                            $this.selectItem(parentList.children('li.ui-picklist-item').eq(i));
                        }
                    } 
                    else {
                        $this.selectItem(item);
                        $this.cursorItem = item;
                    }
                }
            })
            .on('dblclick.pickList', function() {
                var item = $(this);

                if($(this).parent().hasClass('ui-picklist-source'))
                    $this.transfer(item, $this.sourceList, $this.targetList, 'dblclick');
                else
                    $this.transfer(item, $this.targetList, $this.sourceList, 'dblclick');

                PUI.clearSelection();
            });
        },
                
        selectItem: function(item) {
            item.removeClass('ui-state-hover').addClass('ui-state-highlight');
        },

        unselectItem: function(item) {
            item.removeClass('ui-state-highlight');
        },

        unselectAll: function() {
            var selectedItems = this.items.filter('.ui-state-highlight');
            for(var i = 0; i < selectedItems.length; i++) {
                this.unselectItem(selectedItems.eq(i));
            }
        },
                
        _add: function() {
            var items = this.sourceList.children('li.pui-picklist-item.ui-state-highlight')

            this._transfer(items, this.sourceList, this.targetList, 'command');
        },

        _addAll: function() {
            var items = this.sourceList.children('li.pui-picklist-item:visible:not(.ui-state-disabled)');

            this._transfer(items, this.sourceList, this.targetList, 'command');
        },

        _remove: function() {
            var items = this.targetList.children('li.pui-picklist-item.ui-state-highlight');

            this._transfer(items, this.targetList, this.sourceList, 'command');
        },

        _removeAll: function() {
            var items = this.targetList.children('li.pui-picklist-item:visible:not(.ui-state-disabled)');

            this._transfer(items, this.targetList, this.sourceList, 'command');
        },
                
        _moveUp: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            items.each(function() {
                var item = $(this);
                
                if(!item.is(':first-child')) {
                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.insertBefore(item.prev()).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().insertBefore(item.prev()).show();
                    }

                }
            });

            if(!animated) {
                this._saveState();
            }

        },

        _moveTop: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            list.children('.ui-state-highlight').each(function() {
                var item = $(this);

                if(!item.is(':first-child')) {
                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.prependTo(item.parent()).show($this.options.effect, {}, $this.options.effectSpeed, function(){
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().prependTo(item.parent()).show();
                    }
                }
            });

            if(!animated) {
                this._saveState();
            }
        },

        _moveDown: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            $(list.children('.ui-state-highlight').get().reverse()).each(function() {
                var item = $(this);

                if(!item.is(':last-child')) {
                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.insertAfter(item.next()).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().insertAfter(item.next()).show();
                    }
                }

            });

            if(!animated) {
                this._saveState();
            }
        },

        _moveBottom: function(list) {
            var $this = this,
            animated = $this.options.effect,
            items = list.children('.ui-state-highlight'),
            itemsCount = items.length,
            movedCount = 0;

            list.children('.ui-state-highlight').each(function() {
                var item = $(this);

                if(!item.is(':last-child')) {

                    if(animated) {
                        item.hide($this.options.effect, {}, $this.options.effectSpeed, function() {
                            item.appendTo(item.parent()).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                                movedCount++;

                                if(movedCount === itemsCount) {
                                    $this._saveState();
                                }
                            });
                        });
                    }
                    else {
                        item.hide().appendTo(item.parent()).show();
                    }
                }

            });

            if(!animated) {
                this._saveState();
            }
        },
                
        _transfer: function(items, from, to, type) {  
            var $this = this,
            itemsCount = items.length,
            transferCount = 0;

            if(this.options.effect) {
                items.hide(this.options.effect, {}, this.options.effectSpeed, function() {
                    var item = $(this);
                    $this.unselectItem(item);

                    item.appendTo(to).show($this.options.effect, {}, $this.options.effectSpeed, function() {
                        transferCount++;

                        if(transferCount === itemsCount) {
                            $this._saveState();
                            $this._triggerTransferEvent(items, from, to, type);
                        }
                    });
                });
            }
            else {
                items.hide().removeClass('ui-state-highlight ui-state-hover').appendTo(to).show();

                this._saveState();
                this._triggerTransferEvent(items, from, to, type);
            }
        },

        _triggerTransferEvent: function(items, from, to, type) {
            var obj = {};
            obj.items = items;
            obj.from = from;
            obj.to = to;
            obj.type = type;

            this._trigger('transfer', null, obj);
        },
                
        _saveState: function() {
            this.sourceInput.children().remove();
            this.targetInput.children().remove();

            this._generateItems(this.sourceList, this.sourceInput);
            this._generateItems(this.targetList, this.targetInput);
            this.cursorItem = null;
        },
                
        _generateItems: function(list, input) {   
            list.children('.pui-picklist-item').each(function() {
                var item = $(this),
                itemValue = item.data('item-value'),
                itemLabel = item.data('item-label');

                input.append('<option value="' + itemValue + '" selected="selected">' + itemLabel + '</option>');
            });
        }
    });
        
});
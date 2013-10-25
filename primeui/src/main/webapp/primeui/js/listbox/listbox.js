/**
 * PrimeUI listvox widget
 */
$(function() {

    $.widget("primeui.puilistbox", {
       
        options: {
            scrollHeight: 200
        },

        _create: function() {
            this.element.wrap('<div class="pui-listbox pui-inputtext ui-widget ui-widget-content ui-corner-all"><div class="ui-helper-hidden-accessible"></div></div>');
            this.container = this.element.parent().parent();
            this.listContainer = $('<ul class="pui-listbox-list"></ul>').appendTo(this.container);
            this.options.multiple = this.element.prop("multiple");
            
            if(this.options.data) {
                for(var i = 0; i < this.options.data.length; i++) {
                    var choice = this.options.data[i];
                    if(choice.label)
                        this.element.append('<option value="' + choice.value + '">' + choice.label + '</option>');
                    else
                        this.element.append('<option value="' + choice + '">' + choice + '</option>');
                }
            }
            
            this.choices = this.element.children('option');
            for(var i = 0; i < this.choices.length; i++) {
                var choice = this.choices.eq(i),
                content = this.options.content ? this.options.content.call(this, this.options.data[i]) : choice.text();
                this.listContainer.append('<li class="pui-listbox-item ui-corner-all">' + content + '</li>');
            }
            
            this.items = this.listContainer.find('.pui-listbox-item:not(.ui-state-disabled)');

            if(this.container.height() > this.options.scrollHeight) {
                this.container.height(this.options.scrollHeight); 
            }

            this._bindEvents();
        },
                
        _bindEvents: function() {
            var $this = this;

            //items
            this.items.on('mouseover.puilistbox', function() {
                var item = $(this);
                if(!item.hasClass('ui-state-highlight')) {
                    item.addClass('ui-state-hover');
                }
            })
            .on('mouseout.puilistbox', function() {
                $(this).removeClass('ui-state-hover');
            })
            .on('dblclick.puilistbox', function(e) {       
                $this.element.trigger('dblclick');

                PUI.clearSelection();
                e.preventDefault();
            })
            .on('click.puilistbox', function(e) {       
                if($this.options.multiple)
                    $this._clickMultiple(e, $(this));
                else
                    $this._clickSingle(e, $(this));
            
                
            });

            //input
            this.element.on('focus.puilistbox', function() {
                $this.container.addClass('ui-state-focus');
            }).on('blur.puilistbox', function() {
                $this.container.removeClass('ui-state-focus');
            });
        },
        
        _clickSingle: function(event, item) {
            var selectedItem = this.items.filter('.ui-state-highlight');

            if(item.index() !== selectedItem.index()) {
                if(selectedItem.length) {
                    this.unselectItem(selectedItem);
                }

                this.selectItem(item);
                this.element.trigger('change');
            }

            this.element.trigger('click');

            PUI.clearSelection();
            
            event.preventDefault();
        },
                
        _clickMultiple: function(event, item) {            
            var selectedItems = this.items.filter('.ui-state-highlight'),
            metaKey = (event.metaKey||event.ctrlKey),
            unchanged = (!metaKey && selectedItems.length === 1 && selectedItems.index() === item.index());

            if(!event.shiftKey) {
                if(!metaKey) {
                    this.unselectAll();
                }

                if(metaKey && item.hasClass('ui-state-highlight')) {
                    this.unselectItem(item);
                } 
                else {
                    this.selectItem(item);
                    this.cursorItem = item;
                }
            }
            else {
                //range selection
                if(this.cursorItem) {
                    this.unselectAll();
 
                    var currentItemIndex = item.index(),
                    cursorItemIndex = this.cursorItem.index(),
                    startIndex = (currentItemIndex > cursorItemIndex) ? cursorItemIndex : currentItemIndex,
                    endIndex = (currentItemIndex > cursorItemIndex) ? (currentItemIndex + 1) : (cursorItemIndex + 1);
                    
                    for(var i = startIndex ; i < endIndex; i++) {
                        this.selectItem(this.items.eq(i));
                    }
                } 
                else {
                    this.selectItem(item);
                    this.cursorItem = item;
                }
            }
            
            if(!unchanged) {
                this.element.trigger('change');
            }

            this.element.trigger('click');
            PUI.clearSelection();
            event.preventDefault();
        },

        unselectAll: function() {
            this.items.removeClass('ui-state-highlight ui-state-hover');
            this.choices.filter(':selected').prop('selected', false);
        },

        selectItem: function(value) {
            var item = null;
            if($.type(value) === 'number')
                item = this.items.eq(value);
            else
                item = value;
                
            item.addClass('ui-state-highlight').removeClass('ui-state-hover');
            this.choices.eq(item.index()).prop('selected', true);
            this._trigger('itemSelect', null, this.choices.eq(item.index()));
        },

        unselectItem: function(value) {
            var item = null;
            if($.type(value) === 'number')
                item = this.items.eq(value);
            else
                item = value;
            
            item.removeClass('ui-state-highlight');
            this.choices.eq(item.index()).prop('selected', false);
            this._trigger('itemUnselect', null, this.choices.eq(item.index()));
        }
    });
        
});
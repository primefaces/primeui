/**
 * PrimeUI listvox widget
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

    $.widget("primeui.puilistbox", {

        options: {
            value: null,
            scrollHeight: 200,
            content: null,
            data: null,
            template: null,
            style: null,
            styleClass: null,
            multiple: false,
            enhanced: false,
            change: null
        },

        _create: function() {
            if(!this.options.enhanced) {
                this.element.wrap('<div class="ui-listbox ui-inputtext ui-widget ui-widget-content ui-corner-all"><div class="ui-helper-hidden-accessible"></div></div>');
                this.container = this.element.parent().parent();
                this.listContainer = $('<ul class="ui-listbox-list"></ul>').appendTo(this.container);

                if(this.options.data) {
                    this._populateInputFromData();
                }

                this._populateContainerFromOptions();
            }
            else {
                this.container = this.element.parent().parent();
                this.listContainer = this.container.children('ul').addClass('ui-listbox-list');
                this.items = this.listContainer.children('li').addClass('ui-listbox-item ui-corner-all');
                this.choices = this.element.children('option');
            }

            if(this.options.style) {
                this.container.attr('style', this.options.style);
            }

            if(this.options.styleClass) {
                this.container.addClass(this.options.styleClass);
            }

            if(this.options.multiple)
                this.element.prop('multiple', true);
            else
                this.options.multiple = this.element.prop('multiple');

            //preselection
            if(this.options.value !== null && this.options.value !== undefined) {
                this._updateSelection(this.options.value);
            }

            this._restrictHeight();
            this._bindEvents();
        },

        _populateInputFromData: function() {
            for(var i = 0; i < this.options.data.length; i++) {
                var choice = this.options.data[i];
                if(choice.label) {
                    this.element.append('<option value="' + choice.value + '">' + choice.label + '</option>');
                } else {
                    this.element.append('<option value="' + choice + '">' + choice + '</option>');
                }
            }
        },

        _populateContainerFromOptions: function() {
            this.choices = this.element.children('option');
            for(var i = 0; i < this.choices.length; i++) {
                var choice = this.choices.eq(i);
                this.listContainer.append('<li class="ui-listbox-item ui-corner-all">' + this._createItemContent(choice.get(0)) + '</li>');
            }
            this.items = this.listContainer.find('.ui-listbox-item:not(.ui-state-disabled)');
        },

        _restrictHeight: function() {
            if(this.container.height() > this.options.scrollHeight) {
                this.container.height(this.options.scrollHeight);
            }
        },

        _bindEvents: function() {
            var $this = this;

            //items
            this._bindItemEvents(this.items);

            //input
            this.element.on('focus.puilistbox', function() {
                $this.container.addClass('ui-state-focus');
            }).on('blur.puilistbox', function() {
                $this.container.removeClass('ui-state-focus');
            });
        },

        _bindItemEvents: function(item) {
            var $this = this;

            item.on('mouseover.puilistbox', function() {
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
        },

        _unbindEvents: function() {
            this._unbindItemEvents();
            this.element.off('focus.puilistbox blur.puilistbox');
        },

        _unbindItemEvents: function() {
            this.items.off('mouseover.puilistbox mouseout.puilistbox dblclick.puilistbox click.puilistbox');
        },

        _clickSingle: function(event, item) {
            var selectedItem = this.items.filter('.ui-state-highlight');

            if(item.index() !== selectedItem.index()) {
                if(selectedItem.length) {
                    this.unselectItem(selectedItem);
                }

                this.selectItem(item);
                this._trigger('change', event, {
                    value: this.choices.eq(item.index()).attr('value'),
                    index: item.index()
                });
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
                var values = [],
                    indexes = [];
                for(var i = 0; i < this.choices.length; i++) {
                    if(this.choices.eq(i).prop('selected')) {
                        values.push(this.choices.eq(i).attr('value'));
                        indexes.push(i);
                    }
                }

                this._trigger('change', event, {
                    value: values,
                    index: indexes
                })
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
            if($.type(value) === 'number') {
                item = this.items.eq(value);
            }
            else {
                item = value;
            }

            item.addClass('ui-state-highlight').removeClass('ui-state-hover');
            this.choices.eq(item.index()).prop('selected', true);
            this._trigger('itemSelect', null, this.choices.eq(item.index()));
        },

        unselectItem: function(value) {
            var item = null;
            if($.type(value) === 'number') {
                item = this.items.eq(value);
            }
            else {
                item = value;
            }

            item.removeClass('ui-state-highlight');
            this.choices.eq(item.index()).prop('selected', false);
            this._trigger('itemUnselect', null, this.choices.eq(item.index()));
        },

        _setOption: function (key, value) {
            if (key === 'data') {
                this.element.empty();
                this.listContainer.empty();
                this._populateInputFromData();

                this._populateContainerFromOptions();

                this._restrictHeight();
                this._bindEvents();
            }
            else if (key === 'value') {
                this._updateSelection(value);
            }
            else if (key === 'options') {
                this._updateOptions(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        disable: function () {
            this._unbindEvents();
            this.items.addClass('ui-state-disabled');
        },

        enable: function () {
            this._bindEvents();
            this.items.removeClass('ui-state-disabled');
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

        _updateSelection: function(value) {
            this.choices.prop('selected', false);
            this.items.removeClass('ui-state-highlight');

            for(var i = 0; i < this.choices.length; i++) {
                var choice = this.choices.eq(i);
                if(this.options.multiple) {
                    if($.inArray(choice.attr('value'), value) >= 0) {
                        choice.prop('selected', true);
                        this.items.eq(i).addClass('ui-state-highlight');
                    }
                }
                else {
                    if(choice.attr('value') == value) {
                        choice.prop('selected', true);
                        this.items.eq(i).addClass('ui-state-highlight');
                        break;
                    }
                }

            }
        },

        //primeng
        _updateOptions: function(options) {
            var $this = this;
            setTimeout(function() {
                $this.items = $this.listContainer.children('li').addClass('ui-listbox-item ui-corner-all');
                $this.choices = $this.element.children('option');
                $this._unbindItemEvents();
                $this._bindItemEvents(this.items);
            }, 50);
        },

        _destroy: function() {
            this._unbindEvents();

            if(!this.options.enhanced) {
                this.listContainer.remove();
                this.element.unwrap().unwrap();
            }

            if(this.options.style) {
                this.container.removeAttr('style');
            }

            if(this.options.styleClass) {
                this.container.removeClass(this.options.styleClass);
            }

            if(this.options.multiple) {
                this.element.prop('multiple', false);
            }

            if(this.choices) {
                this.choices.prop('selected', false);
            }
        },

        removeAllOptions: function() {
            this.element.empty();
            this.listContainer.empty();
            this.container.empty();
            this.element.val('');
        },

        addOption: function(value,label) {
            var newListItem;

            if(this.options.content) {
                var option = (label) ? {'label':label,'value':value}: {'label':value,'value':value};
                newListItem = $('<li class="ui-listbox-item ui-corner-all"></li>').append(this.options.content(option)).appendTo(this.listContainer);
            }
            else {
                var listLabel = (label) ? label: value;
                newListItem = $('<li class="ui-listbox-item ui-corner-all">' + listLabel + '</li>').appendTo(this.listContainer);
            }

            if(label)
                this.element.append('<option value="' + value + '">' + label + '</option>');
            else
                this.element.append('<option value="' + value + '">' + value + '</option>');

            this._bindItemEvents(newListItem);

            this.choices = this.element.children('option');
            this.items = this.items.add(newListItem);


        }
    });

}));

/**
 * PrimeUI dropdown widget
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

    $.widget("primeui.puidropdown", {

        options: {
            effect: 'fade',
            effectSpeed: 'normal',
            filter: false,
            filterMatchMode: 'startsWith',
            caseSensitiveFilter: false,
            filterFunction: null,
            data: null,
            content: null,
            scrollHeight: 200,
            appendTo: 'body',
            editable: false,
            value: null,
            style: null,
            styleClass: null
        },

        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            if(!this.options.enhanced) {
                if(this.options.data) {
                    if($.isArray(this.options.data)) {
                        this._generateOptionElements(this.options.data);
                    }
                    else {
                        if($.type(this.options.data) === 'function') {
                            this.options.data.call(this, this._onRemoteOptionsLoad);
                            return;
                        }
                        else {
                            if($.type(this.options.data) === 'string') {
                                var $this = this,
                                dataURL = this.options.data;
                                
                                var loader = function() {
                                    $.ajax({
                                        type: 'GET',
                                        url: dataURL,
                                        dataType: "json",
                                        context: $this,
                                        success: function (response) {
                                            this._onRemoteOptionsLoad(response);
                                        }
                                    });
                                };
                                loader.call(this);
                            }
                        }
                        return;
                    }
                }
                
                this._render();
            }
            else {
                this.choices = this.element.children('option');
                this.container = this.element.closest('.ui-dropdown');
                this.focusElementContainer = this.container.children('.ui-helper-hidden-accessible:last');
                this.focusElement = this.focusElementContainer.children('input');
                this.label = this.container.children('.ui-dropdown-label');
                this.menuIcon = this.container.children('.ui-dropdown-trigger');
                this.panel = this.container.children('.ui-dropdown-panel');
                this.itemsWrapper = this.panel.children('.ui-dropdown-items-wrapper');
                this.itemsContainer = this.itemsWrapper.children('ul');
                this.itemsContainer.addClass('ui-dropdown-items ui-dropdown-list ui-widget-content ui-widget ui-corner-all ui-helper-reset');
                this.items = this.itemsContainer.children('li').addClass('ui-dropdown-item ui-corner-all');

                var $this = this;
                this.items.each(function(i) {
                    $(this).data('label', $this.choices.eq(i).text());
                });

                if(this.options.filter) {
                    this.filterContainer = this.panel.children('.ui-dropdown-filter-container');
                    this.filterInput = this.filterContainer.children('input');
                }
            }

            this._postRender();
        },
        
        _render: function() {
            this.choices = this.element.children('option');
            this.element.attr('tabindex', '-1').wrap('<div class="ui-dropdown ui-widget ui-state-default ui-corner-all ui-helper-clearfix" />')
                .wrap('<div class="ui-helper-hidden-accessible" />');

            this.container = this.element.closest('.ui-dropdown');
            this.focusElementContainer = $('<div class="ui-helper-hidden-accessible"><input type="text" /></div>').appendTo(this.container);
            this.focusElement = this.focusElementContainer.children('input');
            this.label = this.options.editable ? $('<input type="text" class="ui-dropdown-label ui-inputtext ui-corner-all"">')
                : $('<label class="ui-dropdown-label ui-inputtext ui-corner-all"/>');
            this.label.appendTo(this.container);
            this.menuIcon = $('<div class="ui-dropdown-trigger ui-state-default ui-corner-right"><span class="fa fa-fw fa-caret-down"></span></div>')
                .appendTo(this.container);

            //panel
            this.panel = $('<div class="ui-dropdown-panel ui-widget-content ui-corner-all ui-helper-hidden ui-shadow" />');
            this.itemsWrapper = $('<div class="ui-dropdown-items-wrapper" />').appendTo(this.panel);
            this.itemsContainer = $('<ul class="ui-dropdown-items ui-dropdown-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>')
                .appendTo(this.itemsWrapper);

            this.optGroupsSize = this.itemsContainer.children('li.puiselectonemenu-item-group').length;

            if(this.options.filter) {
                this.filterContainer = $('<div class="ui-dropdown-filter-container" />').prependTo(this.panel);
                this.filterInput = $('<input type="text" autocomplete="off" class="ui-dropdown-filter ui-inputtext ui-widget ui-state-default ui-corner-all" />')
                    .appendTo(this.filterContainer);
                this.filterContainer.append('<span class="fa fa-search"></span>');
            }

            this._generateItems();
        },
        
        _postRender: function() {
            if(this.options.style) {
                this.container.attr('style', this.options.style);
            }

            if(this.options.styleClass) {
                this.container.addClass(this.options.styleClass);
            }

            this.disabled = this.element.prop('disabled')||this.options.disabled;

            if(this.options.appendTo === 'self')
                this.panel.appendTo(this.container);
            else
                this.panel.appendTo(this.options.appendTo);

            if(this.options.scrollHeight && this.panel.outerHeight() > this.options.scrollHeight) {
                this.itemsWrapper.height(this.options.scrollHeight);
            }

            var $this = this;

            //preselection via value option
            if(this.options.value) {
                this.choices.filter('[value="'+this.options.value+'"]').prop('selected', true);
            }

            var selectedOption = this.choices.filter(':selected');

            //disable options
            this.choices.filter(':disabled').each(function() {
                $this.items.eq($(this).index()).addClass('ui-state-disabled');
            });

            //triggers
            this.triggers = this.options.editable ? this.menuIcon : this.container.children('.ui-dropdown-trigger, .ui-dropdown-label');

            //activate selected
            if(this.options.editable) {
                var customInputVal = this.label.val();

                //predefined input
                if(customInputVal === selectedOption.text()) {
                    this._highlightItem(this.items.eq(selectedOption.index()));
                }
                //custom input
                else {
                    this.items.eq(0).addClass('ui-state-highlight');
                    this.customInput = true;
                    this.customInputVal = customInputVal;
                }
            }
            else {
                this._highlightItem(this.items.eq(selectedOption.index()));
            }

            if(!this.disabled) {
                this._bindEvents();
                this._bindConstantEvents();
            }
        },
        
        _onRemoteOptionsLoad: function(data) {
            this._generateOptionElements(data);
            this._render();
            this._postRender();
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

        _generateItems: function() {
            for(var i = 0; i < this.choices.length; i++) {
                var option = this.choices.eq(i),
                    optionLabel = option.text(),
                    content = this.options.content ? this.options.content.call(this, this.options.data[i]) : optionLabel;

                this.itemsContainer.append('<li data-label="' + optionLabel + '" class="ui-dropdown-item ui-corner-all">' + content + '</li>');
            }

            this.items = this.itemsContainer.children('.ui-dropdown-item');
        },

        _bindEvents: function() {
            var $this = this;

            this.items.filter(':not(.ui-state-disabled)').each(function(i, item) {
                $this._bindItemEvents($(item));
            });

            this.triggers.on('mouseenter.puidropdown', function() {
                    if(!$this.container.hasClass('ui-state-focus')) {
                        $this.container.addClass('ui-state-hover');
                        $this.menuIcon.addClass('ui-state-hover');
                    }
                })
                .on('mouseleave.puidropdown', function() {
                    $this.container.removeClass('ui-state-hover');
                    $this.menuIcon.removeClass('ui-state-hover');
                })
                .on('click.puidropdown', function(e) {
                    if($this.panel.is(":hidden")) {
                        $this._show();
                    }
                    else {
                        $this._hide();

                        $this._revert();
                    }

                    $this.container.removeClass('ui-state-hover');
                    $this.menuIcon.removeClass('ui-state-hover');
                    $this.focusElement.trigger('focus.puidropdown');
                    e.preventDefault();
                });

            this.focusElement.on('focus.puidropdown', function() {
                    $this.container.addClass('ui-state-focus');
                    $this.menuIcon.addClass('ui-state-focus');
                })
                .on('blur.puidropdown', function() {
                    $this.container.removeClass('ui-state-focus');
                    $this.menuIcon.removeClass('ui-state-focus');
                });

            if(this.options.editable) {
                this.label.on('change.ui-dropdown', function() {
                    $this._triggerChange(true);
                    $this.customInput = true;
                    $this.customInputVal = $(this).val();
                    $this.items.filter('.ui-state-highlight').removeClass('ui-state-highlight');
                    $this.items.eq(0).addClass('ui-state-highlight');
                });
            }

            this._bindKeyEvents();

            if(this.options.filter) {
                this._setupFilterMatcher();

                this.filterInput.puiinputtext();

                this.filterInput.on('keyup.ui-dropdown', function() {
                    $this._filter($(this).val());
                });
            }
        },

        _bindItemEvents: function(item) {
            var $this = this;

            item.on('mouseover.puidropdown', function() {
                    var el = $(this);

                    if(!el.hasClass('ui-state-highlight'))
                        $(this).addClass('ui-state-hover');
                })
                .on('mouseout.puidropdown', function() {
                    $(this).removeClass('ui-state-hover');
                })
                .on('click.puidropdown', function() {
                    $this._selectItem($(this));
                });
        },

        _bindConstantEvents: function() {
            var $this = this;

            $(document.body).on('mousedown.ui-dropdown-' + this.id, function (e) {
                if($this.panel.is(":hidden")) {
                    return;
                }

                var offset = $this.panel.offset();
                if (e.target === $this.label.get(0) ||
                    e.target === $this.menuIcon.get(0) ||
                    e.target === $this.menuIcon.children().get(0)) {
                    return;
                }

                if (e.pageX < offset.left ||
                    e.pageX > offset.left + $this.panel.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.panel.height()) {

                    $this._hide();
                    $this._revert();
                }
            });

            this.resizeNS = 'resize.' + this.id;
            this._unbindResize();
            this._bindResize();
        },

        _bindKeyEvents: function() {
            var $this = this;

            this.focusElement.on('keydown.puidropdown', function(e) {
                var keyCode = $.ui.keyCode,
                    key = e.which,
                    activeItem;

                switch(key) {
                    case keyCode.UP:
                    case keyCode.LEFT:
                        activeItem = $this._getActiveItem();
                        var prev = activeItem.prevAll(':not(.ui-state-disabled,.ui-selectonemenu-item-group):first');

                        if(prev.length == 1) {
                            if($this.panel.is(':hidden')) {
                                $this._selectItem(prev);
                            }
                            else {
                                $this._highlightItem(prev);
                                PUI.scrollInView($this.itemsWrapper, prev);
                            }
                        }

                        e.preventDefault();
                        break;

                    case keyCode.DOWN:
                    case keyCode.RIGHT:
                        activeItem = $this._getActiveItem();
                        var next = activeItem.nextAll(':not(.ui-state-disabled,.ui-selectonemenu-item-group):first');

                        if(next.length == 1) {
                            if($this.panel.is(':hidden')) {
                                if(e.altKey) {
                                    $this._show();
                                } else {
                                    $this._selectItem(next);
                                }
                            }
                            else {
                                $this._highlightItem(next);
                                PUI.scrollInView($this.itemsWrapper, next);
                            }
                        }

                        e.preventDefault();
                        break;

                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        if($this.panel.is(':hidden')) {
                            $this._show();
                        }
                        else {
                            $this._selectItem($this._getActiveItem());
                        }

                        e.preventDefault();
                        break;

                    case keyCode.TAB:
                        if($this.panel.is(':visible')) {
                            $this._revert();
                            $this._hide();
                        }
                        break;

                    case keyCode.ESCAPE:
                        if($this.panel.is(':visible')) {
                            $this._revert();
                            $this._hide();
                        }
                        break;

                    default:
                        var k = String.fromCharCode((96 <= key && key <= 105)? key-48 : key),
                            currentItem = $this.items.filter('.ui-state-highlight');

                        //Search items forward from current to end and on no result, search from start until current
                        var highlightItem = $this._search(k, currentItem.index() + 1, $this.options.length);
                        if(!highlightItem) {
                            highlightItem = $this._search(k, 0, currentItem.index());
                        }

                        if(highlightItem) {
                            if($this.panel.is(':hidden')) {
                                $this._selectItem(highlightItem);
                            }
                            else {
                                $this._highlightItem(highlightItem);
                                PUI.scrollInView($this.itemsWrapper, highlightItem);
                            }
                        }

                        break;
                }
            });
        },

        _unbindEvents: function() {
            this.items.off('mouseover.puidropdown mouseout.puidropdown click.puidropdown');
            this.triggers.off('mouseenter.puidropdown mouseleave.puidropdown click.puidropdown');
            this.focusElement.off('keydown.puidropdown focus.puidropdown blur.puidropdown');

            if(this.options.editable) {
                this.label.off('change.puidropdown');
            }

            if(this.options.filter) {
                this.filterInput.off('keyup.ui-dropdown');
            }

            $(document.body).off('mousedown.ui-dropdown-' + this.id);
            this._unbindResize();
        },

        _selectItem: function(item, silent) {
            var selectedOption = this.choices.eq(this._resolveItemIndex(item)),
                currentOption = this.choices.filter(':selected'),
                sameOption = selectedOption.val() == currentOption.val(),
                shouldChange = null;

            if(this.options.editable) {
                shouldChange = (!sameOption)||(selectedOption.text() != this.label.val());
            }
            else {
                shouldChange = !sameOption;
            }

            if(shouldChange) {
                this._highlightItem(item);
                this.element.val(selectedOption.val());

                this._triggerChange();

                if(this.options.editable) {
                    this.customInput = false;
                }
            }

            if(!silent) {
                this.focusElement.trigger('focus.puidropdown');
            }

            if(this.panel.is(':visible')) {
                this._hide();
            }
        },

        _highlightItem: function(item) {
            this.items.filter('.ui-state-highlight').removeClass('ui-state-highlight');

            if(item.length) {
                item.addClass('ui-state-highlight');
                
                this._setLabel(item.data('label'));
            }
            else {
                this._setLabel('&nbsp;');
            }
        },

        _triggerChange: function(edited) {
            this.changed = false;
            var selectedOption = this.choices.filter(':selected');

            if(this.options.change) {
                this._trigger('change', null, {
                    value: selectedOption.val(),
                    index: selectedOption.index()
                });
            }

            if(!edited) {
                this.value = this.choices.filter(':selected').val();
            }
        },

        _resolveItemIndex: function(item) {
            if(this.optGroupsSize === 0) {
                return item.index();
            }
            else {
                return item.index() - item.prevAll('li.ui-dropdown-item-group').length;
            }
        },

        _setLabel: function(value) {
            if(this.options.editable) {
                this.label.val(value);
            }
            else {
                if(value === '&nbsp;') {
                    this.label.html('&nbsp;');
                }
                else {
                    this.label.text(value);
                }
            }
        },

        _bindResize: function() {
            var $this = this;

            $(window).bind(this.resizeNS, function(e) {
                if($this.panel.is(':visible')) {
                    $this._alignPanel();
                }
            });
        },

        _unbindResize: function() {
            $(window).unbind(this.resizeNS);
        },

        _alignPanelWidth: function() {
            if(!this.panelWidthAdjusted) {
                var jqWidth = this.container.outerWidth();
                if(this.panel.outerWidth() < jqWidth) {
                    this.panel.width(jqWidth);
                }

                this.panelWidthAdjusted = true;
            }
        },

        _alignPanel: function() {
            if(this.panel.parent().is(this.container)) {
                this.panel.css({
                        left: '0px',
                        top: this.container.outerHeight() + 'px'
                    })
                    .width(this.container.outerWidth());
            }
            else {
                this._alignPanelWidth();
                this.panel.css({left:'', top:''}).position({
                    my: 'left top',
                    at: 'left bottom',
                    of: this.container,
                    collision: 'flipfit'
                });
            }
        },

        _show: function() {
            this._alignPanel();

            this.panel.css('z-index', ++PUI.zindex);

            if(this.options.effect !== 'none') {
                this.panel.show(this.options.effect, {}, this.options.effectSpeed);
            }
            else {
                this.panel.show();
            }
            this.preShowValue = this.choices.filter(':selected');
        },

        _hide: function() {
            this.panel.hide();
        },

        _revert: function() {
            if(this.options.editable && this.customInput) {
                this._setLabel(this.customInputVal);
                this.items.filter('.ui-state-active').removeClass('ui-state-active');
                this.items.eq(0).addClass('ui-state-active');
            }
            else {
                this._highlightItem(this.items.eq(this.preShowValue.index()));
            }
        },

        _getActiveItem: function() {
            return this.items.filter('.ui-state-highlight');
        },

        _setupFilterMatcher: function() {
            this.filterMatchers = {
                'startsWith': this._startsWithFilter,
                'contains': this._containsFilter,
                'endsWith': this._endsWithFilter,
                'custom': this.options.filterFunction
            };

            this.filterMatcher = this.filterMatchers[this.options.filterMatchMode];
        },

        _startsWithFilter: function(value, filter) {
            return value.indexOf(filter) === 0;
        },

        _containsFilter: function(value, filter) {
            return value.indexOf(filter) !== -1;
        },

        _endsWithFilter: function(value, filter) {
            return value.indexOf(filter, value.length - filter.length) !== -1;
        },

        _filter: function(value) {
            this.initialHeight = this.initialHeight||this.itemsWrapper.height();
            var filterValue = this.options.caseSensitiveFilter ? $.trim(value) : $.trim(value).toLowerCase();

            if(filterValue === '') {
                this.items.filter(':hidden').show();
            }
            else {
                for(var i = 0; i < this.choices.length; i++) {
                    var option = this.choices.eq(i),
                        itemLabel = this.options.caseSensitiveFilter ? option.text() : option.text().toLowerCase(),
                        item = this.items.eq(i);

                    if(this.filterMatcher(itemLabel, filterValue))
                        item.show();
                    else
                        item.hide();
                }
            }

            if(this.itemsContainer.height() < this.initialHeight) {
                this.itemsWrapper.css('height', 'auto');
            }
            else {
                this.itemsWrapper.height(this.initialHeight);
            }

            this._alignPanel();
        },

        _search: function(text, start, end) {
            for(var i = start; i  < end; i++) {
                var option = this.choices.eq(i);

                if(option.text().indexOf(text) === 0) {
                    return this.items.eq(i);
                }
            }

            return null;
        },

        getSelectedValue: function() {
            return this.element.val();
        },

        getSelectedLabel: function() {
            return this.choices.filter(':selected').text();
        },

        selectValue : function(value) {
            var option = this.choices.filter('[value="' + value + '"]');

            this._selectItem(this.items.eq(option.index()), true);
        },

        addOption: function(option, val) {
            var value, label;

            //backward compatibility for key-value parameters
            if(val !== undefined && val !== null) {
                value = val;
                label = option;
            }
            //key-value as properties of option object
            else {
                value = (option.value !== undefined && option.value !== null) ? option.value : option;
                label = (option.label !== undefined && option.label !== null) ? option.label : option;
            }

            var content = this.options.content ? this.options.content.call(this, option) : label,
                item = $('<li data-label="' + label + '" class="ui-dropdown-item ui-corner-all">' + content + '</li>'),
                optionElement = $('<option value="' + value + '">' + label + '</option>');

            optionElement.appendTo(this.element);
            this._bindItemEvents(item);
            item.appendTo(this.itemsContainer);
            this.items.push(item[0]);
            this.choices = this.element.children('option');

            // If this is the first option, it is the default selected one
            if (this.items.length === 1) {
                this.selectValue(value);
                this._highlightItem(item);
            }
        },

        removeAllOptions: function() {
            this.element.empty();
            this.itemsContainer.empty();
            this.items.length = 0;
            this.choices.length = 0;
            this.element.val('');
            this.label.text('');
        },

        _setOption: function (key, value) {
            if (key === 'data' || key === 'options') {
                this.options.data = value;
                this.removeAllOptions();

                for(var i = 0; i < this.options.data.length; i++) {
                    this.addOption(this.options.data[i]);
                }

                if(this.options.scrollHeight && this.panel.outerHeight() > this.options.scrollHeight) {
                    this.itemsWrapper.height(this.options.scrollHeight);
                }
            }
            else if(key === 'value') {
                this.options.value = value;
                this.choices.prop('selected', false);
                var selectedOption = this.choices.filter('[value="'+this.options.value+'"]');
                if(selectedOption.length) {
                    selectedOption.prop('selected', true);
                    this._highlightItem(this.items.eq(selectedOption.index()));
                }
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        disable: function() {
            this._unbindEvents();
            this.label.addClass('ui-state-disabled');
            this.menuIcon.addClass('ui-state-disabled');
        },

        enable: function() {
            this._bindEvents();
            this.label.removeClass('ui-state-disabled');
            this.menuIcon.removeClass('ui-state-disabled');
        },

        getEditableText: function() {
            return this.label.val();
        },

        _destroy: function() {
            this._unbindEvents();
            if(!this.options.enhanced) {
                this.panel.remove();
                this.label.remove();
                this.menuIcon.remove();
                this.focusElementContainer.remove();
                this.element.unwrap().unwrap();
            }
            else {
                if(this.options.appendTo == 'body') {
                    this.panel.appendTo(this.container);
                }

                if(this.options.style) {
                    this.container.removeAttr('style');
                }

                if(this.options.styleClass) {
                    this.container.removeClass(this.options.styleClass);
                }
            }
        }
    });

}));
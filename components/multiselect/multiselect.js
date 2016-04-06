/**
 * PrimeUI MultiSelect Widget
 */
(function() {

    $.widget("primeui.puimultiselect", {

        options: {
            defaultLabel: 'Choose',
            caseSensitive: false,
            filterMatchMode: 'startsWith',
            filterFunction: null,
            data: null,
            scrollHeight:200,
            style: null,
            styleClass: null
        },

        _create: function() {
            if(this.options.data) {
                if($.isArray(this.options.data)) {
                    this._generateOptionElements(this.options.data);
                }
            }
            this._render();

            if(this.options.style) {
                this.container.attr('style', this.options.style);
            }

            if(this.options.styleClass) {
                this.container.addClass(this.options.styleClass);
            }

            this.inputs = this.element.find(':checkbox');
            this.checkboxes = this.itemContainer.find('.ui-chkbox-box:not(.ui-state-disabled)');
            this.triggers = this.container.find('.ui-multiselect-trigger, .ui-multiselect-label');

            this._generateItems();
            this.labels = this.itemContainer.find('label');

            this._bindEvents();
        },

        _render: function() {
            this.choices = this.element.children('option');
            this.element.attr('tabindex', '0').wrap('<div class="ui-multiselect ui-widget ui-state-default ui-corner-all" />')
                .wrap('<div class="ui-helper-hidden-accessible" />');
            this.container = this.element.closest('.ui-multiselect');
            this.container.append('<div class="ui-helper-hidden-accessible"><input readonly="readonly" type="text" /></div>');
            this.labelContainer = $('<div class="ui-multiselect-label-container"><label class="ui-multiselect-label ui-corner-all">' + this.options.defaultLabel +
             '</label></div>').appendTo(this.container);
            this.menuIcon = $('<div class="ui-multiselect-trigger ui-state-default ui-corner-right"><span class="fa fa-fw fa-caret-down"></span></div>')
                .appendTo(this.container);

            this._renderPanel();

            //filter
            this.filterContainer = $('<div class="ui-multiselect-filter-container" />').appendTo(this.panelHeader);
            this.filterInput = $('<input type="text" aria-readonly="false" aria-disabled="false" aria-multiline="false" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" />')
                .appendTo(this.filterContainer);
            this.filterContainer.append('<span class="fa fa-search"></span>');

            this.closeIcon = $('<a class="ui-multiselect-close ui-corner-all" href="#"><span class="fa fa-close"></span></a>').appendTo(this.panelHeader);
            this.container.append(this.panel);
        },

        _renderPanel: function() {
            //panel
            this.panel = $('<div id="'+this.element.attr('id')+ "_panel" +'"class="ui-multiselect-panel ui-widget ui-widget-content ui-corner-all ui-helper-hidden"/>');
            this.panelHeader = $('<div class="ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix"></div>').appendTo(this.panel);
            this.toggler = $('<div class="ui-chkbox ui-widget">' +
                '<div class="ui-helper-hidden-accessible"><input readonly="readonly" type="checkbox"/></div>' +
                '<div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default"><span class="ui-chkbox-icon ui-c"></span></div>' +
                    '</div>');
            this.togglerBox = this.toggler.children('.ui-chkbox-box');
            this.panelHeader.append(this.toggler);
            this.itemsWrapper = $('<div class="ui-multiselect-items-wrapper" />').appendTo(this.panel);
            this.itemContainer = $('<ul class="ui-multiselect-items ui-multiselect-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>')
                .appendTo(this.itemsWrapper);

            if(this.options.scrollHeight) {
                this.itemsWrapper.height(this.options.scrollHeight);
            }
            else if(this.inputs.length > 10) {
                this.itemsWrapper.height(200)
            }
        },

        _generateItems: function() {
            for(var i = 0; i < this.choices.length; i++) {
                var option = this.choices.eq(i),
                    optionLabel = option.text();
                this.listItems = $('<li data-label="' + optionLabel + '" class="ui-multiselect-item ui-corner-all">' +
                '<div class="ui-chkbox ui-widget">' +
                    '<div class="ui-helper-hidden-accessible"><input readonly="readonly" type="checkbox"/></div>' +
                    '<div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default"><span class="ui-chkbox-icon ui-c"></span></div>' +
                '</div>' + '<label>' + optionLabel + '</label>' + '</li>').appendTo(this.itemContainer);
            }

            this.items = this.itemContainer.children('.ui-multiselect-item');

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

        _bindEvents: function() {
            var $this = this,
            hideNS = 'mousedown.',
            resizeNS = 'resize.';

            this.items.filter(':not(.ui-state-disabled)').each(function(i, item) {
                $this._bindItemEvents($(item));
            });

            //Events for checkboxes
            this._bindCheckboxHover(this.checkboxes);
            this.checkboxes.on('click.puimultiselect', function() {
                $this._toggleItem($(this));
            });

            //Toggler
            this._bindCheckboxHover(this.togglerBox);
            this.togglerBox.on('click.puimultiselect', function() {
                var el = $(this);
                if(el.hasClass('ui-state-active')) {
                    $this.uncheckAll();
                    el.addClass('ui-state-hover');
                }
                else {
                    $this.checkAll();
                    el.removeClass('ui-state-hover');
                }
                $this._toggleItem($(this));
            });

            //Filter
            this._setupFilterMatcher();
            this.filterInput.on('keyup.puimultiselect', function() {
                $(this).trigger('focus');
                $this.filter($(this).val());
            })
            .on('focus.puimultiselect', function() {
                $(this).addClass('ui-state-focus');
            })
            .on('blur.puimultiselect', function() {
                $(this).removeClass('ui-state-focus');
            });

            //Container focus
            this.element.on('focus.puimultiselect', function() {
                $this.container.addClass('ui-state-focus');
            })
            .on('blur.puimultiselect', function() {
                $this.container.removeClass('ui-state-focus');
            });

            //Closer
            this.closeIcon.on('mouseenter.puimultiselect', function(){
                $(this).addClass('ui-state-hover');
            }).on('mouseleave.puimultiselect', function() {
                $(this).removeClass('ui-state-hover');
            }).on('click.puimultiselect', function(e) {
                $this.hide(true);

                e.preventDefault();
            });

            //Labels
            this.items.on('click.puimultiselect', function() {
                var checkbox = $(this).find('.ui-chkbox-box');
                $this._toggleItem(checkbox);
                checkbox.removeClass('ui-state-hover');
                PUI.clearSelection();
            });

            //Events to show/hide the panel
            this.triggers.on('mouseover.puimultiselect', function() {
                if(!$this.disabled&&!$this.triggers.hasClass('ui-state-focus')) {
                    $this.triggers.addClass('ui-state-hover');
                }
            }).on('mouseout.puimultiselect', function() {
                if(!$this.disabled) {
                    $this.triggers.removeClass('ui-state-hover');
                }
            }).on('mousedown.puimultiselect', function(e) {
                if(!$this.disabled) {
                    if($this.panel.is(":hidden")) {
                        $this.show();
                    }
                    else {
                        $this.hide(true);
                    }
                }
            })
            .on('focus.puimultiselect', function() {
                $(this).addClass('ui-state-focus');
            })
            .on('blur.puimultiselect', function() {
                $(this).removeClass('ui-state-focus');
            })
            .on('click.puimultiselect', function(e) {
                $this.element.trigger('focus.puimultiselect');
                e.preventDefault();
            });

            this._bindKeyEvents();

            //hide overlay when outside is clicked
            $(document.body).off(hideNS).on(hideNS, function (e) {
                if($this.panel.is(':hidden')) {
                    return;
                }

                //do nothing on trigger mousedown
                var target = $(e.target);
                if($this.triggers.is(target)||$this.triggers.has(target).length > 0) {
                    return;
                }

                //hide the panel and remove focus from label
                var offset = $this.panel.offset();
                if(e.pageX < offset.left ||
                    e.pageX > offset.left + $this.panel.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.panel.height()) {
                    $this.hide(true);
                }
            });

            //Realign overlay on resize
            $(window).off(resizeNS).on(resizeNS, function() {
                if($this.panel.is(':visible')) {
                    $this.alignPanel();
                }
            });
        },

        _bindItemEvents: function(item) {
            var $this = this;

            item.on('mouseover.puimultiselect', function() {
                    var el = $(this);

                    if(!el.hasClass('ui-state-highlight'))
                        $(this).addClass('ui-state-hover');
                })
                .on('mouseout.puimultiselect', function() {
                    $(this).removeClass('ui-state-hover');
                })
        },

        _bindKeyEvents: function() {
            var $this = this;

            this.element.on('focus.puimultiselect', function() {
                $(this).addClass('ui-state-focus');
                $this.menuIcon.addClass('ui-state-focus');
            }).on('blur.puimultiselect', function() {
                $(this).removeClass('ui-state-focus');
                $this.menuIcon.removeClass('ui-state-focus');
            }).on('keydown.puimultiselect', function(e) {
                var keyCode = $.ui.keyCode,
                key = e.which;

                switch(key) {
                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        if($this.panel.is(":hidden"))
                            $this.show();
                        else
                            $this.hide(true);

                        e.preventDefault();
                    break;

                    case keyCode.TAB:
                        if($this.panel.is(':visible')) {

                            $this.toggler.find('> div.ui-helper-hidden-accessible > input').trigger('focus');

                            e.preventDefault();
                        }

                    break;

                };
            });

            this.closeIcon.on('focus.puimultiselect', function(e) {
                $this.closeIcon.addClass('ui-state-focus');
            })
            .on('blur.puimultiselect', function(e) {
                $this.closeIcon.removeClass('ui-state-focus');
            })
            .on('keydown.puimultiselect', function(e) {
                var keyCode = $.ui.keyCode,
                key = e.which;

                if(key === keyCode.ENTER || key === keyCode.NUMPAD_ENTER) {
                    $this.hide(true);
                    e.preventDefault();
                }
            });

            var togglerCheckboxInput = this.toggler.find('> div.ui-helper-hidden-accessible > input');
            this._bindCheckboxKeyEvents(togglerCheckboxInput);
            togglerCheckboxInput.on('keyup.puimultiselect', function(e) {
                        if(e.which === $.ui.keyCode.SPACE) {
                            var input = $(this);

                            if(input.prop('checked'))
                                $this.uncheckAll();
                            else
                                $this.checkAll();

                            e.preventDefault();
                        }
                    });

            var itemKeyInputs = this.itemContainer.find('> li > div.ui-chkbox > div.ui-helper-hidden-accessible > input');
            this._bindCheckboxKeyEvents(itemKeyInputs);
            itemKeyInputs.on('keyup.selectCheckboxMenu', function(e) {
                        if(e.which === $.ui.keyCode.SPACE) {
                            var input = $(this),
                            box = input.parent().next();

                            if(input.prop('checked'))
                                $this.uncheck(box, true);
                            else
                                $this.check(box, true);

                            e.preventDefault();
                        }
                    });
        },

        _bindCheckboxHover: function(item) {
            item.on('mouseenter.puimultiselect', function() {
                var item = $(this);
                if(!item.hasClass('ui-state-active')&&!item.hasClass('ui-state-disabled')) {
                    item.addClass('ui-state-hover');
                }
            }).on('mouseleave.puimultiselect', function() {
                $(this).removeClass('ui-state-hover');
            });
        },

        _bindCheckboxKeyEvents: function(items) {
            var $this = this;
            items.on('focus.puimultiselect', function(e) {
                var input = $(this),
                box = input.parent().next();

                if(input.prop('checked')) {
                    box.removeClass('ui-state-active');
                }

                box.addClass('ui-state-focus');
            })
            .on('blur.puimultiselect', function(e) {
                var input = $(this),
                box = input.parent().next();

                if(input.prop('checked')) {
                    box.addClass('ui-state-active');
                }

                box.removeClass('ui-state-focus');
            })
            .on('keydown.puimultiselect', function(e) {
                if(e.which === $.ui.keyCode.SPACE) {
                    e.preventDefault();
                }
            });
        },

        _toggleItem: function(checkbox) {
            if(!checkbox.hasClass('ui-state-disabled')) {
                if(checkbox.hasClass('ui-state-active')) {
                    this.uncheck(checkbox, true);
                    checkbox.addClass('ui-state-hover');
                }
                else {
                    this.check(checkbox, true);
                    checkbox.removeClass('ui-state-hover');
                }
            }
        },

        filter: function(value) {
            var filterValue = this.options.caseSensitive ? $.trim(value) : $.trim(value).toLowerCase();

            if(filterValue === '') {
                this.itemContainer.children('li.ui-multiselect-item').filter(':hidden').show();
            }
            else {
                for(var i = 0; i < this.labels.length; i++) {
                    var labelElement = this.labels.eq(i),
                    item = labelElement.parent(),
                    itemLabel = this.options.caseSensitive ? labelElement.text() : labelElement.text().toLowerCase();

                    if(this.filterMatcher(itemLabel, filterValue)) {
                        item.show();
                    }
                    else {
                        item.hide();
                    }
                }
            }

            this.updateToggler();
        },

        _setupFilterMatcher: function() {
            this.options.filterMatchMode = this.options.filterMatchMode||'startsWith';
            this.filterMatchers = {
                'startsWith': this.startsWithFilter
                ,'contains': this.containsFilter
                ,'endsWith': this.endsWithFilter
                ,'custom': this.options.filterFunction
            };

            this.filterMatcher = this.filterMatchers[this.options.filterMatchMode];
        },

        startsWithFilter: function(value, filter) {
            return value.indexOf(filter) === 0;
        },

        containsFilter: function(value, filter) {
            return value.indexOf(filter) !== -1;
        },

        endsWithFilter: function(value, filter) {
            return value.indexOf(filter, value.length - filter.length) !== -1;
        },

        show: function() {
            this.alignPanel();

            this.panel.show();

            this.postShow();
        },

        hide: function(animate) {
            var $this = this;

            if(animate) {
                this.panel.fadeOut('fast', function() {
                    $this.postHide();
                });
            }

            else {
                this.panel.hide();
                this.postHide();
            }
        },

        postShow: function() {
            this.panel.trigger('onShow.puimultiselect');
        },

        postHide: function() {
            this.panel.trigger('onHide.puimultiselect');
        },

        check: function(checkbox, updateInput) {
            if(!checkbox.hasClass('ui-state-disabled')) {
                var checkedInput = checkbox.prev().children('input');

                checkedInput.prop('checked', true);
                if(updateInput) {
                    checkedInput.trigger('focus.puimultiselect');
                }

                checkbox.addClass('ui-state-active').children('.ui-chkbox-icon').addClass('fa fa-fw fa-check');
                checkbox.closest('li.ui-multiselect-item').removeClass('ui-multiselect-unchecked').addClass('ui-multiselect-checked');

                if(updateInput) {
                    var input = this.inputs.eq(checkbox.parents('li:first').index());
                    input.prop('checked', true).change();

                    this.updateToggler();
                }
            }
        },

        uncheck: function(checkbox, updateInput) {
            if(!checkbox.hasClass('ui-state-disabled')) {
                var uncheckedInput = checkbox.prev().children('input');
                checkbox.removeClass('ui-state-active').children('.ui-chkbox-icon').addClass('ui-icon-blank').removeClass('fa fa-fw fa-check');
                checkbox.closest('li.ui-multiselect-item').addClass('ui-multiselect-unchecked').removeClass('ui-multiselect-checked');
                uncheckedInput.prop('checked', false);

                if(updateInput) {
                    var input = this.inputs.eq(checkbox.parents('li:first').index());
                    input.prop('checked', false).change();
                    uncheckedInput.trigger('focus.puimultiselect');
                    this.updateToggler();
                }
            }
        },

        updateToggler: function() {
            var visibleItems = this.itemContainer.children('li.ui-multiselect-item:visible');

            if(visibleItems.length && visibleItems.filter('.ui-multiselect-checked').length === visibleItems.length) {
                this.check(this.togglerBox);
            }
            else {
                this.uncheck(this.togglerBox);
            }
        },

        checkAll: function() {
            var visibleItems = this.itemContainer.children('li.ui-multiselect-item').filter(':visible'),
            $this = this;

            visibleItems.each(function() {
                $this.inputs.eq($(this).index()).prop('checked', true);
                $this.check($(this).children('.ui-chkbox').children('.ui-chkbox-box'));
            });

            this.check(this.togglerBox);

            if(!this.togglerBox.hasClass('ui-state-disabled')) {
                this.togglerBox.prev().children('input').trigger('focus.puimultiselect');
                this.togglerBox.addClass('ui-state-active');
            }
        },

        uncheckAll: function() {
            var visibleItems = this.itemContainer.children('li.ui-multiselect-item').filter(':visible'),
            $this = this;

            visibleItems.each(function() {
                $this.inputs.eq($(this).index()).prop('checked', false);
                $this.uncheck($(this).children('.ui-chkbox').children('.ui-chkbox-box'));
            });

            this.uncheck(this.togglerBox);

            if(!this.togglerBox.hasClass('ui-state-disabled')) {
                this.togglerBox.prev().children('input').trigger('focus.puimultiselect');
            }

        },

        alignPanel: function() {
            var fixedPosition = this.panel.css('position') == 'fixed',
            win = $(window),
            positionOffset = fixedPosition ? '-' + win.scrollLeft() + ' -' + win.scrollTop() : null,
            panelStyle = this.panel.attr('style');

            this.panel.css({
                    'left':'',
                    'top':'',
                    'z-index': ++PUI.zindex
            });

            if(this.panel.parent().attr('id') === this.id) {
                this.panel.css({
                    left: 0,
                    top: this.container.innerHeight()
                });
            }
            else {
                this.panel.position({
                                    my: 'left top'
                                    ,at: 'left bottom'
                                    ,of: this.container
                                    ,offset : positionOffset
                                });
            }

            if(!this.widthAligned && (this.panel.width() < this.container.width()) && (!panelStyle||panelStyle.toLowerCase().indexOf('width') === -1)) {
                this.panel.width(this.container.width());
                this.widthAligned = true;
            }
        }
    });
})();

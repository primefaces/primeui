/**
 * PrimeUI MultiSelect Widget
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

    $.widget("primeui.puimultiselect", {

        options: {
            defaultLabel: 'Choose',
            caseSensitive: false,
            filterMatchMode: 'startsWith',
            filterFunction: null,
            data: null,
            scrollHeight: 200,
            style: null,
            styleClass: null,
            value: null
        },

        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }

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

            this.triggers = this.container.find('.ui-multiselect-trigger, .ui-multiselect-label');
            this.label = this.labelContainer.find('.ui-multiselect-label');

            this._generateItems();

            //preselection via value option
            if(this.options.value && this.options.value.length) {
                var checkboxes = this.items.find('.ui-chkbox-box');
                for (var i = 0; i < this.options.value.length; i++) {
                    var index =  this.findSelectionIndex(this.options.value[i]);
                    this.selectItem(this.items.eq(index));                    
                }
                this.updateLabel();
            }

            this._bindEvents();
        },

        _render: function() {
            this.choices = this.element.children('option');
            this.element.attr('tabindex', '0').wrap('<div class="ui-multiselect ui-widget ui-state-default ui-corner-all ui-shadow" />')
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
                '<div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default"><span class="ui-chkbox-icon ui-c fa fa-fw"></span></div>' +
                    '</div>');
            this.togglerBox = this.toggler.children('.ui-chkbox-box');
            this.panelHeader.append(this.toggler);
            this.itemsWrapper = $('<div class="ui-multiselect-items-wrapper" />').appendTo(this.panel);
            this.itemContainer = $('<ul class="ui-multiselect-items ui-multiselect-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>')
                .appendTo(this.itemsWrapper);

            this.itemsWrapper.css('max-height', this.options.scrollHeight);
        },

        _generateItems: function() {
            for(var i = 0; i < this.choices.length; i++) {
                var option = this.choices.eq(i),
                    optionLabel = option.text();
                this.listItems = $('<li data-label="' + optionLabel + '" class="ui-multiselect-item ui-corner-all">' +
                '<div class="ui-chkbox ui-widget">' +
                    '<div class="ui-helper-hidden-accessible"><input readonly="readonly" type="checkbox"/></div>' +
                    '<div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default"><span class="ui-chkbox-icon ui-c fa fa-fw"></span></div>' +
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
            hideNS = 'click.' + this.id,
            resizeNS = 'resize.' + this.id;

            this._bindItemEvents(this.items.filter(':not(.ui-state-disabled)'));
            
            //Toggler
            this._bindCheckboxHover(this.togglerBox);
            this.togglerBox.on('click.puimultiselect', function() {
                var el = $(this);
                if(el.children('.ui-chkbox-icon').hasClass('fa-check'))
                    $this.uncheckAll();
                else
                    $this.checkAll();
                    
                $this.updateLabel();
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

            //Events to show/hide the panel
            this.triggers.on('mouseover.puimultiselect', function() {
                if(!$this.disabled&&!$this.triggers.hasClass('ui-state-focus')) {
                    $this.triggers.addClass('ui-state-hover');
                }
            }).on('mouseout.puimultiselect', function() {
                if(!$this.disabled) {
                    $this.triggers.removeClass('ui-state-hover');
                }
            }).on('click.puimultiselect', function(e) {
                if(!$this.disabled) {
                    if($this.panel.is(":hidden"))
                        $this.show();
                    else
                        $this.hide(true);
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
                .on('click.puimultiselect', function() {
                    $this._toggleItem($(this));
                    PUI.clearSelection();
                });
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
                            
                            $this._toggleItem(input.closest('li'));

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

        _toggleItem: function(item) {
            if(item.hasClass('ui-state-highlight'))
                this.unselectItem(item);
            else
                this.selectItem(item);
            
            this.updateLabel();
            this.updateToggler();
        },
        
        selectItem: function(item) {
            var checkbox = item.find('> .ui-chkbox');
            item.addClass('ui-state-highlight');
            checkbox.find(':checkbox').prop('checked', true);
            checkbox.find('> .ui-chkbox-box > .ui-chkbox-icon').addClass('fa-check');
            this.choices.eq(item.index()).prop('selected', true);
        },
        
        unselectItem: function(item) {
            var checkbox = item.find('> .ui-chkbox');
            item.removeClass('ui-state-highlight');
            checkbox.find(':checkbox').prop('checked', false);
            checkbox.find('> .ui-chkbox-box > .ui-chkbox-icon').removeClass('fa-check');
            this.choices.eq(item.index()).prop('selected', false);
        },

        filter: function(value) {
            var filterValue = this.options.caseSensitive ? $.trim(value) : $.trim(value).toLowerCase();

            if(filterValue === '') {
                this.itemContainer.children('li.ui-multiselect-item').filter(':hidden').show();
            }
            else {
                for(var i = 0; i < this.choices.length; i++) {
                    var choice = this.choices.eq(i),
                    item = this.items.eq(i),
                    itemLabel = this.options.caseSensitive ? choice.text() : choice.text().toLowerCase();

                    if(this.filterMatcher(itemLabel, filterValue))
                        item.show();
                    else
                        item.hide();
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

        findSelectionIndex: function(val){
            var index = -1;

            if(this.choices) {
                for(var i = 0; i < this.choices.length; i++) {
                    if(this.choices.eq(i).val() == val) {
                        index = i;
                        break;
                    }
                }
            }

            return index;
        },

        updateLabel: function() {
            var selectedItems = this.choices.filter(':selected'),
            label = null;

            if(selectedItems.length) {
                label = '';
                for(var i = 0; i < selectedItems.length; i++) {
                    if(i != 0) {
                        label = label + ',';
                    }
                    label = label + selectedItems.eq(i).text();
                }
            }
            else {
                label = this.options.defaultLabel;
            }
            
            this.label.text(label);
        },

        updateToggler: function() {
            var visibleItems = this.itemContainer.children('li.ui-multiselect-item:visible');

            if(visibleItems.length && visibleItems.filter('.ui-state-highlight').length === visibleItems.length) {
                this.toggler.find(':checkbox').prop('checked', true);
                this.togglerBox.children('.ui-chkbox-icon').addClass('fa-check');
            }
            else {
                this.toggler.find(':checkbox').prop('checked', false);
                this.togglerBox.children('.ui-chkbox-icon').removeClass('fa-check');
            }
        },

        checkAll: function() {
            var visibleItems = this.items.filter(':visible'),
            $this = this;

            visibleItems.each(function() {
                $this.selectItem($(this));
            });
        
            this.toggler.find(':checkbox').prop('checked', true);
            this.togglerBox.children('.ui-chkbox-icon').addClass('fa-check');
        },

        uncheckAll: function() {
            var visibleItems = this.items.filter(':visible'),
            $this = this;

            visibleItems.each(function() {
                $this.unselectItem($(this));
            });
            
            this.toggler.find(':checkbox').prop('checked', false);
            this.togglerBox.children('.ui-chkbox-icon').removeClass('fa-check');
        },

        alignPanel: function() {
            this.panel.css({
                    'left':'',
                    'top':'',
                    'z-index': ++PUI.zindex
            });

            this.panel.show().position({
                                my: 'left top'
                                ,at: 'left bottom'
                                ,of: this.container
                            });
        }
    });
    
}));

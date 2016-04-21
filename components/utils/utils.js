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

    $.widget("primeui.puicolresize", {

        options: {
            mode: 'fit'
        },

        _create: function() {
            this.element.addClass('ui-datatable-resizable');
            this.thead = this.element.find('> .ui-datatable-tablewrapper > table > thead');
            this.thead.find('> tr > th').addClass('ui-resizable-column');
            this.resizerHelper = $('<div class="ui-column-resizer-helper ui-state-highlight"></div>').appendTo(this.element);
            this.addResizers();

            var resizers = this.thead.find('> tr > th > span.ui-column-resizer'),
            $this = this;

            setTimeout(function() {
                $this.fixColumnWidths();
            }, 5);

            resizers.draggable({
                axis: 'x',
                start: function(event, ui) {
                    ui.helper.data('originalposition', ui.helper.offset());

                    var height = $this.options.scrollable ? $this.scrollBody.height() : $this.thead.parent().height() - $this.thead.height() - 1;
                    $this.resizerHelper.height(height);
                    $this.resizerHelper.show();
                },
                drag: function(event, ui) {
                    $this.resizerHelper.offset({
                        left: ui.helper.offset().left + ui.helper.width() / 2,
                        top: $this.thead.offset().top + $this.thead.height()
                    });
                },
                stop: function(event, ui) {
                    ui.helper.css({
                        'left': '',
                        'top': '0px',
                        'right': '0px'
                    });

                    $this.resize(event, ui);
                    $this.resizerHelper.hide();

                    if($this.options.mode === 'expand') {
                        setTimeout(function() {
                            $this._trigger('colResize', null, {element: ui.helper.parent().get(0)});
                        }, 5);
                    }
                    else {
                        $this._trigger('colResize', null, {element: ui.helper.parent().get(0)});
                    }
                },
                containment: this.element
            });
        },

        resize: function(event, ui) {
            var columnHeader, nextColumnHeader, change = null, newWidth = null, nextColumnWidth = null,
            expandMode = (this.options.mode === 'expand'),
            table = this.thead.parent(),
            columnHeader = ui.helper.parent(),
            nextColumnHeader = columnHeader.next();

            change = (ui.position.left - ui.originalPosition.left),
            newWidth = (columnHeader.width() + change),
            nextColumnWidth = (nextColumnHeader.width() - change);

            if((newWidth > 15 && nextColumnWidth > 15) || (expandMode && newWidth > 15)) {
                if(expandMode) {
                    table.width(table.width() + change);
                    setTimeout(function() {
                        columnHeader.width(newWidth);
                    }, 1);
                }
                else {
                    columnHeader.width(newWidth);
                    nextColumnHeader.width(nextColumnWidth);
                }
            }
        },

        addResizers: function() {
            var resizableColumns = this.thead.find('> tr > th.ui-resizable-column');
            resizableColumns.prepend('<span class="ui-column-resizer">&nbsp;</span>');

            if(this.options.columnResizeMode === 'fit') {
                resizableColumns.filter(':last-child').children('span.ui-column-resizer').hide();
            }
        },

        fixColumnWidths: function() {
            if(!this.columnWidthsFixed) {
                this.element.find('> .ui-datatable-tablewrapper > table > thead > tr > th').each(function() {
                    var col = $(this);
                    col.width(col.width());
                });

                this.columnWidthsFixed = true;
            }
        },

        _destroy: function() {
            this.element.removeClass('ui-datatable-resizable');
            this.thead.find('> tr > th').removeClass('ui-resizable-column');
            this.resizerHelper.remove();
            this.thead.find('> tr > th > span.ui-column-resizer').draggable('destroy').remove();
        }
    });

    $.widget("primeui.puicolreorder", {

        _create: function() {
            var $this = this;

            this.thead = this.element.find('> .ui-datatable-tablewrapper > table > thead');
            this.tbody = this.element.find('> .ui-datatable-tablewrapper > table > tbody');
            this.dragIndicatorTop = $('<span class="fa fa-arrow-down" style="position:absolute"/></span>').hide().appendTo(this.element);
            this.dragIndicatorBottom = $('<span class="fa fa-arrow-up" style="position:absolute"/></span>').hide().appendTo(this.element);

            this.thead.find('> tr > th').draggable({
                appendTo: 'body',
                opacity: 0.75,
                cursor: 'move',
                scope: this.id,
                cancel: ':input,.ui-column-resizer',
                drag: function(event, ui) {
                    var droppable = ui.helper.data('droppable-column');

                    if(droppable) {
                        var droppableOffset = droppable.offset(),
                            topArrowY = droppableOffset.top - 10,
                            bottomArrowY = droppableOffset.top + droppable.height() + 8,
                            arrowX = null;

                        //calculate coordinates of arrow depending on mouse location
                        if(event.originalEvent.pageX >= droppableOffset.left + (droppable.width() / 2)) {
                            var nextDroppable = droppable.next();
                            if(nextDroppable.length == 1)
                                arrowX = nextDroppable.offset().left - 9;
                            else
                                arrowX = droppable.offset().left + droppable.innerWidth() - 9;

                            ui.helper.data('drop-location', 1);     //right
                        }
                        else {
                            arrowX = droppableOffset.left  - 9;
                            ui.helper.data('drop-location', -1);    //left
                        }

                        $this.dragIndicatorTop.offset({
                            'left': arrowX,
                            'top': topArrowY - 3
                        }).show();

                        $this.dragIndicatorBottom.offset({
                            'left': arrowX,
                            'top': bottomArrowY - 3
                        }).show();
                    }
                },
                stop: function(event, ui) {
                    //hide dnd arrows
                    $this.dragIndicatorTop.css({
                        'left':0,
                        'top':0
                    }).hide();

                    $this.dragIndicatorBottom.css({
                        'left':0,
                        'top':0
                    }).hide();
                },
                helper: function() {
                    var header = $(this),
                    helper = $('<div class="ui-widget ui-state-default" style="padding:4px 10px;text-align:center;"></div>');

                    helper.width(header.width());
                    helper.height(header.height());

                    helper.html(header.html());

                    return helper.get(0);
                }
            })
            .droppable({
                hoverClass:'ui-state-highlight',
                tolerance:'pointer',
                scope: this.id,
                over: function(event, ui) {
                    ui.helper.data('droppable-column', $(this));
                },
                drop: function(event, ui) {
                    var draggedColumnHeader = ui.draggable,
                        droppedColumnHeader =  $(this),
                        dropLocation = ui.helper.data('drop-location');

                    $this._trigger('colReorder', null, {
                        dragIndex: draggedColumnHeader.index(),
                        dropIndex: droppedColumnHeader.index(),
                        dropSide: dropLocation
                    });
                }
            });
        },

        _destroy: function() {
            this.dragIndicatorTop.remove();
            this.dragIndicatorBottom.remove();
            this.thead.find('> tr > th').draggable('destroy').droppable('destroy');
        }
    });

    $.widget("primeui.puitablescroll", {

        options: {
            scrollHeight: null,
            scrollWidth: null
        },

        _create: function() {
            this.id = PUI.generateRandomId();
            this.scrollHeader = this.element.children('.ui-datatable-scrollable-header');
            this.scrollBody = this.element.children('.ui-datatable-scrollable-body');
            this.scrollFooter = this.element.children('.ui-datatable-scrollable-footer');
            this.scrollHeaderBox = this.scrollHeader.children('.ui-datatable-scrollable-header-box');
            this.bodyTable = this.scrollBody.children('table');
            this.percentageScrollHeight = this.options.scrollHeight && (this.options.scrollHeight.indexOf('%') !== -1);
            this.percentageScrollWidth = this.options.scrollWidth && (this.options.scrollWidth.indexOf('%') !== -1);
            var $this = this,
                scrollBarWidth = this.getScrollbarWidth() + 'px';

            if(this.options.scrollHeight) {
                if(this.percentageScrollHeight)
                    this.adjustScrollHeight();
                else
                    this.scrollBody.css('max-height', this.options.scrollHeight + 'px');

                this.scrollHeaderBox.css('margin-right', scrollBarWidth);
            }

            if(this.options.scrollWidth) {
                if(this.percentageScrollWidth)
                    this.adjustScrollWidth();
                else
                    this.setScrollWidth(parseInt(this.options.scrollWidth));
            }

            this.scrollBody.on('scroll.dataTable', function() {
                var scrollLeft = $this.scrollBody.scrollLeft();
                $this.scrollHeaderBox.css('margin-left', -scrollLeft);
            });

            this.scrollHeader.on('scroll.dataTable', function() {
                $this.scrollHeader.scrollLeft(0);
            });

            $(window).on('resize.' + this.id, function() {
                if($this.element.is(':visible')) {
                    if($this.percentageScrollHeight)
                        $this.adjustScrollHeight();

                    if($this.percentageScrollWidth)
                        $this.adjustScrollWidth();
                }
            });
        },

        _destroy: function() {
            $(window).off('resize.' + this.id);
            this.scrollHeader.off('scroll.dataTable');
            this.scrollBody.off('scroll.dataTable');
        },

        adjustScrollHeight: function() {
            var relativeHeight = this.element.parent().parent().innerHeight() * (parseInt(this.options.scrollHeight) / 100),
                tableHeaderHeight = this.element.children('.ui-datatable-header').outerHeight(true),
                tableFooterHeight = this.element.children('.ui-datatable-footer').outerHeight(true),
                scrollersHeight = (this.scrollHeader.outerHeight(true) + this.scrollFooter.outerHeight(true)),
                paginatorsHeight = this.paginator ? this.paginator.getContainerHeight(true) : 0,
                height = (relativeHeight - (scrollersHeight + paginatorsHeight + tableHeaderHeight + tableFooterHeight));

            this.scrollBody.css('max-height', height + 'px');
        },

        adjustScrollWidth: function() {
            var width = parseInt((this.element.parent().parent().innerWidth() * (parseInt(this.options.scrollWidth) / 100)));
            this.setScrollWidth(width);
        },

        setOuterWidth: function(element, width) {
            var diff = element.outerWidth() - element.width();
            element.width(width - diff);
        },

        setScrollWidth: function(width) {
            var $this = this;
            this.element.children('.ui-widget-header').each(function() {
                $this.setOuterWidth($(this), width);
            });
            this.scrollHeader.width(width);
            this.scrollBody.css('margin-right', 0).width(width);
        },

        getScrollbarWidth: function() {
            if(!this.scrollbarWidth) {
                this.scrollbarWidth = PUI.calculateScrollbarWidth();
            }

            return this.scrollbarWidth;
        }
    });

}));

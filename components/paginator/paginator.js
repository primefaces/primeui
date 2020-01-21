/**
 * PrimeUI Paginator Widget
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

    var ElementHandlers = {

        '{FirstPageLink}': {
            markup: '<a class="ui-paginator-first ui-paginator-element ui-state-default ui-corner-all"><span class="fa fa-step-backward"></span></a>',

            create: function(paginator) {
                var element = $(this.markup);

                if(paginator.options.page === 0) {
                    element.addClass('ui-state-disabled');
                }

                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', 0);
                    }
                });

                return element;
            },

            update: function(element, state) {
                if(state.page === 0) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-active');
                }
                else {
                    element.removeClass('ui-state-disabled');
                }
            }
        },

        '{PreviousPageLink}': {
            markup: '<a class="ui-paginator-prev ui-paginator-element ui-state-default ui-corner-all"><span class="fa fa-backward"></span></a>',

            create: function(paginator) {
                var element = $(this.markup);

                if(paginator.options.page === 0) {
                    element.addClass('ui-state-disabled');
                }

                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.options.page - 1);
                    }
                });

                return element;
            },

            update: function(element, state) {
                if(state.page === 0) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-active');
                }
                else {
                    element.removeClass('ui-state-disabled');
                }
            }
        },

        '{NextPageLink}': {
            markup: '<a class="ui-paginator-next ui-paginator-element ui-state-default ui-corner-all"><span class="fa fa-forward"></span></a>',

            create: function(paginator) {
                var element = $(this.markup);

                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-active');
                }

                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.options.page + 1);
                    }
                });

                return element;
            },

            update: function(element, state) {
                if(state.page === (state.pageCount - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-active');
                }
                else {
                    element.removeClass('ui-state-disabled');
                }
            }
        },

        '{LastPageLink}': {
            markup: '<a class="ui-paginator-last ui-paginator-element ui-state-default ui-corner-all"><span class="fa fa-step-forward"></span></a>',

            create: function(paginator) {
                var element = $(this.markup);

                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-active');
                }

                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.getPageCount() - 1);
                    }
                });

                return element;
            },

            update: function(element, state) {
                if(state.page === (state.pageCount - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-active');
                }
                else {
                    element.removeClass('ui-state-disabled');
                }
            }
        },

        '{PageLinks}': {
            markup: '<span class="ui-paginator-pages"></span>',

            create: function(paginator) {
                var element = $(this.markup),
                boundaries = this.calculateBoundaries({
                    page: paginator.options.page,
                    pageLinks: paginator.options.pageLinks,
                    pageCount: paginator.getPageCount()
                }),
                start = boundaries[0],
                end = boundaries[1];

                for(var i = start; i <= end; i++) {
                    var pageLinkNumber = (i + 1),
                    pageLinkElement = $('<a class="ui-paginator-page ui-paginator-element ui-state-default ui-corner-all">' + pageLinkNumber + "</a>");

                    if(i === paginator.options.page) {
                        pageLinkElement.addClass('ui-state-active');
                    }

                    pageLinkElement.on('click.puipaginator', function(e){
                        var link = $(this);

                        if(!link.hasClass('ui-state-disabled')&&!link.hasClass('ui-state-active')) {
                            paginator.option('page', parseInt(link.text(), 10) - 1);
                        }
                    });

                    element.append(pageLinkElement);
                }

                return element;
            },

            update: function(element, state, paginator) {
                var pageLinks = element.children(),
                boundaries = this.calculateBoundaries({
                    page: state.page,
                    pageLinks: state.pageLinks,
                    pageCount: state.pageCount
                }),
                start = boundaries[0],
                end = boundaries[1];

                pageLinks.remove();

                for(var i = start; i <= end; i++) {
                    var pageLinkNumber = (i + 1),
                    pageLinkElement = $('<a class="ui-paginator-page ui-paginator-element ui-state-default ui-corner-all">' + pageLinkNumber + "</a>");

                    if(i === state.page) {
                        pageLinkElement.addClass('ui-state-active');
                    }

                    pageLinkElement.on('click.puipaginator', function(e){
                        var link = $(this);

                        if(!link.hasClass('ui-state-disabled')&&!link.hasClass('ui-state-active')) {
                            paginator.option('page', parseInt(link.text(), 10) - 1);
                        }
                    });

                    element.append(pageLinkElement);
                }
            },

            calculateBoundaries: function(config) {
                var page = config.page,
                pageLinks = config.pageLinks,
                pageCount = config.pageCount,
                visiblePages = Math.min(pageLinks, pageCount);

                //calculate range, keep current in middle if necessary
                var start = Math.max(0, parseInt(Math.ceil(page - ((visiblePages) / 2)), 10)),
                end = Math.min(pageCount - 1, start + visiblePages - 1);

                //check when approaching to last page
                var delta = pageLinks - (end - start + 1);
                start = Math.max(0, start - delta);

                return [start, end];
            }
        }

    };

    $.widget("primeui.puipaginator", {

        options: {
            pageLinks: 5,
            totalRecords: 0,
            page: 0,
            rows: 0,
            template: '{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}'
        },

        _create: function() {
            this.element.addClass('ui-paginator ui-widget-header');
            this.paginatorElements = [];

            var elementKeys = this.options.template.split(/[ ]+/);
            for(var i = 0; i < elementKeys.length;i++) {
                var elementKey = elementKeys[i],
                handler = ElementHandlers[elementKey];

                if(handler) {
                    var paginatorElement = handler.create(this);
                    this.paginatorElements[elementKey] = paginatorElement;
                    this.element.append(paginatorElement);
                }
            }
        },

        _setOption: function(key, value) {
            if(key === 'page')
                this.setPage(value);
            else if(key === 'totalRecords')
                this.setTotalRecords(value);
            else
                $.Widget.prototype._setOption.apply(this, arguments);
        },

        setPage: function(p, silent) {
            var pc = this.getPageCount();

            if(p >= 0 && p < pc) {
                var newState = {
                    first: this.options.rows * p,
                    rows: this.options.rows,
                    page: p,
                    pageCount: pc,
                    pageLinks: this.options.pageLinks
                };

                this.options.page = p;

                if(!silent) {
                    this._trigger('paginate', null, newState);
                }

                this.updateUI(newState);
            }
        },

        //state contains page and totalRecords
        setState: function(state) {
            this.options.totalRecords = state.totalRecords;
            this.setPage(state.page, true);
        },

        updateUI: function(state) {
            for(var paginatorElementKey in this.paginatorElements) {
                if(this.paginatorElements.hasOwnProperty(paginatorElementKey)) {
                    ElementHandlers[paginatorElementKey].update(this.paginatorElements[paginatorElementKey], state, this);
                }
            }
        },

        getPageCount: function() {
            return Math.ceil(this.options.totalRecords / this.options.rows)||1;
        },

        setTotalRecords: function(value) {
            this.options.totalRecords = value;
             if (this.options.page >= this.getPageCount())
				this.setPage(this.getPageCount() - 1);
			else
				this.setPage(this.options.page, true);
        }
    });

}));

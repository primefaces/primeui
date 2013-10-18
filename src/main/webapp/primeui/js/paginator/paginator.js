/**
 * PrimeUI Paginator Widget
 */
$(function() {

    var ElementHandlers = {
        
        '{FirstPageLink}': {
            markup: '<span class="pui-paginator-first pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-first">p</span></span>',
            
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
                if(state.page === 0)
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{PreviousPageLink}': {
            markup: '<span class="pui-paginator-prev pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-prev">p</span></span>',
                    
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
                if(state.page === 0)
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{NextPageLink}': {
            markup: '<span class="pui-paginator-next pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-next">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);
                
                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.options.page + 1);
                    }
                });
                
                return element;
            },
                    
            update: function(element, state) {
                if(state.page === (state.pageCount - 1))
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{LastPageLink}': {
            markup: '<span class="pui-paginator-last pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-end">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);

                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.getPageCount() - 1);
                    }
                });
                
                return element;
            },
            
            update: function(element, state) {
                if(state.page === (state.pageCount - 1))
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{PageLinks}': {
            markup: '<span class="pui-paginator-pages"></span>',
                    
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
                    pageLinkElement = $('<span class="pui-paginator-page pui-paginator-element ui-state-default ui-corner-all">' + pageLinkNumber + "</span>");
                    
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
                    
            update: function(element, state) {
                var pageLinks = element.children(),
                boundaries = this.calculateBoundaries({
                    page: state.page,
                    pageLinks: state.pageLinks,
                    pageCount: state.pageCount
                }),
                start = boundaries[0],
                end = boundaries[1],
                p = 0;
        
                pageLinks.filter('.ui-state-active').removeClass('ui-state-active');
                
                for(var i = start; i <= end; i++) {
                    var pageLinkNumber = (i + 1),
                    pageLink = pageLinks.eq(p);
            
                    if(i === state.page) {
                        pageLink.addClass('ui-state-active');
                    }
                    
                    pageLink.text(pageLinkNumber);
            
                    p++;
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
            this.element.addClass('pui-paginator ui-widget-header');
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
            
            this._bindEvents();
        },
                
        _bindEvents: function() {
            this.element.find('span.pui-paginator-element')
                    .on('mouseover.puipaginator', function() {
                        var el = $(this);
                        if(!el.hasClass('ui-state-active')&&!el.hasClass('ui-state-disabled')) {
                            el.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.puipaginator', function() {
                        var el = $(this);
                        if(el.hasClass('ui-state-hover')) {
                            el.removeClass('ui-state-hover');
                        }
                    });
        },
        
        _setOption: function(key, value) {
            if(key === 'page') {
                this.setPage(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
                
        setPage: function(p, silent) {
            var pc = this.getPageCount();
            
            if(p >= 0 && p < pc && this.options.page !== p) {        
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
                
        updateUI: function(state) {
            for(var paginatorElementKey in this.paginatorElements) {
                ElementHandlers[paginatorElementKey].update(this.paginatorElements[paginatorElementKey], state);
            }
        },
                
        getPageCount: function() {
            return Math.ceil(this.options.totalRecords / this.options.rows)||1;
        }
    });
});
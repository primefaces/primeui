/**
 * PrimeUI Datagrid Widget
 */
$(function() {

    $.widget("primeui.puidatagrid", {
       
        options: {
            columns: 3,
            datasource: null,
            paginator: null,
            header: null,
            footer: null,
            content: null
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            var $this = this;
            
            this.element.addClass('pui-datagrid ui-widget');
            
            //header
            if(this.options.header) {
                this.element.append('<div class="pui-datagrid-header ui-widget-header ui-corner-top">' + this.options.header + '</div>');
            }
            
            //content
            this.content = $('<div class="pui-datagrid-content ui-widget-content pui-grid pui-grid-responsive"></div>').appendTo(this.element);
            
            //footer
            if(this.options.footer) {
                this.element.append('<div class="pui-datagrid-footer ui-widget-header ui-corner-top">' + this.options.footer + '</div>');
            }
            
            //data
            if(this.options.datasource) {
                if($.isArray(this.options.datasource)) {
                    this.data = this.options.datasource;
                    this._initialize();
                }
                else if($.type(this.options.datasource) === 'function') {
                    if(this.options.lazy)
                        this.options.datasource.call(this, this._onDataInit, {first:0, sortField:this.options.sortField, sortOrder:this.options.sortOrder});
                    else
                        this.options.datasource.call(this, this._onDataInit);
                }
            }
        },
                
        _initialize: function() {
            var $this = this;
            
            if(this.options.paginator) {
                this.options.paginator.paginate = function(event, state) {
                    $this.paginate();
                };
                
                this.options.paginator.totalRecords = this.options.paginator.totalRecords||this.data.length;
                this.paginator = $('<div></div>').insertAfter(this.content).puipaginator(this.options.paginator);
            }

            this._renderData();
        },

        _onDataInit: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
                
            this._initialize();
        },
                
        _onDataUpdate: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
                
            this._renderData();
        },
        
        _onLazyLoad: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
            
            this._renderData();
        },
                
        paginate: function() {
            if(this.options.lazy) {
                this.options.datasource.call(this, this._onLazyLoad, this._createStateMeta());
            }
            else {
               this._renderData();
            }
        },
               
        _renderData: function() {
            if(this.data) {
                this.content.html('');
                
                var firstNonLazy = this._getFirst(),
                first = this.options.lazy ? 0 : firstNonLazy,
                rows = this._getRows(),
                gridRow = null;

                for(var i = first; i < (first + rows); i++) {
                    var dataValue = this.data[i];
                    
                    if(dataValue) {
                        if(i % this.options.columns === 0) {
                            gridRow = $('<div class="pui-grid-row"></div>').appendTo(this.content);
                        }
                        
                        var gridColumn = $('<div class="pui-datagrid-column pui-grid-col-4"></div>').appendTo(gridRow),
                        markup = this.options.content.call(this, dataValue);
                        
                        gridColumn.append(markup);
                    }
                }
            }
        },
                                
        _getFirst: function() {
            if(this.paginator) {
                var page = this.paginator.puipaginator('option', 'page'),
                rows = this.paginator.puipaginator('option', 'rows');
                
                return (page * rows);
            }
            else {
                return 0;
            }
        },
        
        _getRows: function() {
            return this.paginator ? this.paginator.puipaginator('option', 'rows') : this.data.length;
        },
            
        _createStateMeta: function() {
            var state = {
                first: this._getFirst(),
                rows: this._getRows()
            };
            
            return state;
        },
                
        _updateDatasource: function(datasource) {
            this.options.datasource = datasource;
            
            this.reset();
            
            if($.isArray(this.options.datasource)) {
                this.data = this.options.datasource;
                this._renderData();
            }
            else if($.type(this.options.datasource) === 'function') {
                if(this.options.lazy) {
                    this.options.datasource.call(this, this._onDataUpdate, {first:0, sortField:this.options.sortField, sortorder:this.options.sortOrder});
                }
                else {
                    this.options.datasource.call(this, this._onDataUpdate);
                }
            }
        },
                
        _setOption: function(key, value) {
            if(key === 'datasource') {
                this._updateDatasource(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        }
        
    });
});
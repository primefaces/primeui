/**
 * PrimeUI Datagrid Widget
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

    $.widget("primeui.puidatagrid", {
       
        options: {
            columns: 3,
            datasource: null,
            paginator: null,
            header: null,
            footer: null,
            content: null,
            lazy: false,
            template: null
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
                        
            this.element.addClass('ui-datagrid ui-widget');
            
            //header
            if(this.options.header) {
                this.element.append('<div class="ui-datagrid-header ui-widget-header ui-corner-top">' + this.options.header + '</div>');
            }
            
            //content
            this.content = $('<div class="ui-datagrid-content ui-widget-content ui-datagrid-col-' + this.options.columns + '"></div>').appendTo(this.element);
            
            //footer
            if(this.options.footer) {
                this.element.append('<div class="ui-datagrid-footer ui-widget-header ui-corner-top">' + this.options.footer + '</div>');
            }
            
            //data
            if(this.options.datasource) {
                this._initDatasource();
            }
        },
        
        _onDataInit: function(data) {
            this._onDataUpdate(data);
            this._initPaginator();
        },
                
        _onDataUpdate: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
            
            this.reset();
                
            this._renderData();
        },
        
        _onLazyLoad: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
            
            this._renderData();
        },
        
        reset: function() {            
            if(this.paginator) {
                this.paginator.puipaginator('setState', {
                    page: 0,
                    totalRecords: this.options.lazy ? this.options.paginator.totalRecords : this.data.length
                });
            }
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
                        var gridColumn = $('<div></div>').appendTo(this.content),
                        markup = this._createItemContent(dataValue);
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
            if(this.options.paginator)
                return this.paginator ? this.paginator.puipaginator('option', 'rows') : this.options.paginator.rows; 
            else
                return this.data ? this.data.length : 0;
        },
            
        _createStateMeta: function() {
            var state = {
                first: this._getFirst(),
                rows: this._getRows()
            };
            
            return state;
        },
        
        _initPaginator: function() {
            var $this = this;
            if(this.options.paginator) {
                this.options.paginator.paginate = function(event, state) {
                    $this.paginate();
                };
                
                this.options.paginator.totalRecords = this.options.lazy ? this.options.paginator.totalRecords : this.data.length;
                this.paginator = $('<div></div>').insertAfter(this.content).puipaginator(this.options.paginator);
            }
        },
        
        _initDatasource: function() {
            if($.isArray(this.options.datasource)) {
                this._onDataInit(this.options.datasource);
            }
            else {
                if($.type(this.options.datasource) === 'string') {
                    var $this = this,
                    dataURL = this.options.datasource;

                    this.options.datasource = function() {
                        $.ajax({
                            type: 'GET',
                            url: dataURL,
                            dataType: "json",
                            context: $this,
                            success: function (response) {
                                this._onDataInit(response);
                            }
                        });
                    };
                }
                
                if($.type(this.options.datasource) === 'function') {
                    if(this.options.lazy)
                        this.options.datasource.call(this, this._onDataInit, {first:0, rows: this._getRows()});
                    else
                        this.options.datasource.call(this, this._onDataInit);
                }
            }
        },
                
        _updateDatasource: function(datasource) {
            this.options.datasource = datasource;
            
            if($.isArray(this.options.datasource)) {
                this._onDataUpdate(this.options.datasource);
            }
            else if($.type(this.options.datasource) === 'function') {
                if(this.options.lazy)
                    this.options.datasource.call(this, this._onDataUpdate, {first:0, rows: this._getRows()});
                else
                    this.options.datasource.call(this, this._onDataUpdate);
            }
        },
                
        _setOption: function(key, value) {
            if(key === 'datasource') {
                this._updateDatasource(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
        
        _createItemContent: function(obj) {
            if(this.options.template) {
                var templateContent = this.options.template.html();
                Mustache.parse(templateContent);
                return Mustache.render(templateContent, obj);
            }
            else {
                return this.options.content.call(this, obj);
            }
        }
        
    });
    
}));
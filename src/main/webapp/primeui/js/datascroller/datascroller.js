/**
 * PrimeUI Datascroller Widget
 */
(function() {

    $.widget("primeui.puidatascroller", {
       
        options: {
            header:null,
            buffer: 10,
            chunksize: 10,
            initchunk: 20,
            datasource: null,
            lazy: false,
            content: null,
            template: null,
            mode: 'document' || 'self' ,
            manuelmode: false
        },
        
        _create: function() {
            if(!this.options.manuelmode) {
                if(this.options.mode === 'document') {
                    this.element.addClass('pui-datascroller ui-widget');
                    this.container = $('<div class="pui-datascroller-content ui-widget-content ui-corner-bottom"></div>').appendTo(this.element);
                    this.container.append('<ul class="pui-datascroller-list"></ul>');
                    
                }
                else  {
                    this.element.addClass('pui-datascroller pui-datascroller-inline ui-widget');
                    this.container = $('<div class="pui-datascroller-content ui-widget-content ui-corner-bottom" style="height:500px"></div>').appendTo(this.element);
                    this.container.append('<ul class="pui-datascroller-list"></ul>');
                }
            }
            else {
                this.element.addClass('pui-datascroller ui-widget');
                this.container = $('<div class="pui-datascroller-content ui-widget-content ui-corner-bottom"></div>').appendTo(this.element);
                this.container.append('<ul class="pui-datascroller-list"></ul>').append('<div class="pui-datascroller-loader"></div>');
                this.loaderContainer = this.container.children('div.pui-datascroller-loader');
                this.loaderContainer.append('<button type="button" class="pui-button ui-widget ui-state-default ui-corner-all pui-button-text-icon-left"></button>');
                this.loadTrigger = this.loaderContainer.children('button');
                this.loadTrigger.append('<span class="pui-button-icon-left ui-icon ui-c ui-icon-circle-triangle-s"></span>').append('<span class="pui-button-text ui-c">More</span>')
            }
            //header
            if(this.options.header) {
                this.element.prepend('<div class="pui-datascroller-header ui-widget-header ui-corner-top">' + this.options.header + '</div>');
            }

            this.loadStatus = $('<div class="pui-datascroller-loading"></div>');
            this.loading = false;
            this.allLoaded = false;
            this.options.buffer = (100 - this.options.buffer) / 100;
            this.listContainer = this.container.children('ul');

            this._render(this.options.datasource);
            if(!this.options.manuelmode) {
                this._load();
            }
            else
                this._manuelLoad(); 
        },
        _render: function(data) {
            this.data = data;
            if(this.data) {
                if (data.length <= 20) {
                    if($.isArray(this.options.datasource)) {
                        for (var i = 0; i < data.length; i++) {
                            var itemContent = this.options.content.call(this,this.options.datasource[i]);

                            if($.type(itemContent) === 'string')
                                this.listContainer.append('<li class="pui-datascroller-item">' + itemContent + '</li>');
                            else
                                this.listContainer.append($('<li class="pui-datascroller-item"></li>').wrapInner(itemContent));
                        }
                    }
                }
                else {
                    if($.isArray(this.options.datasource)) {
                        for (var i = 0; i < this.options.initchunk; i++) {
                            var itemContent = this.options.content.call(this,this.options.datasource[i]);

                            if($.type(itemContent) === 'string')
                                this.listContainer.append('<li class="pui-datascroller-item">' + itemContent + '</li>');
                            else
                                this.listContainer.append($('<li class="pui-datascroller-item"></li>').wrapInner(itemContent));
                        }
                    }
                }

            }
        },
        _load: function() { 
            var $this = this,
            offset = $this.options.initchunk,
            totalSize = $this.options.datasource.length;
            if(this.options.mode === 'document') {
                var win = $(window),
                doc = $(document),
                NS = 'scroll.' + this.id;
                
                win.off(NS).on(NS, function () {
                    if(win.scrollTop() >= ((doc.height() * $this.options.buffer) - win.height()) && $this.shouldLoad()) {
                        for (var i = offset; i < offset + $this.options.chunksize; i++) {
                            var itemContent = $this.options.content.call(this,$this.options.datasource[i]);
                            if($.type(itemContent) === 'string')
                                $this.listContainer.append('<li class="pui-datascroller-item">' + itemContent + '</li>');
                            else
                                $this.listContainer.append($('<li class="pui-datascroller-item"></li>').wrapInner(itemContent));
                        }
                        offset += $this.options.chunksize;
                        if(offset === totalSize) {
                            $this.allLoaded = true;
                            $this.loading = false;
                            $this.loadStatus.remove();
                        }  
                    }
                });
            }
            else {
                this.container.on('scroll', function () {
                    var scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    viewportHeight = this.clientHeight;

                    if((scrollTop >= ((scrollHeight * $this.options.buffer) - (viewportHeight))) && $this.shouldLoad()) {
                        for (var i = offset; i < offset + $this.options.chunksize; i++) {
                            var itemContent = $this.options.content.call(this,$this.options.datasource[i]);
                            if($.type(itemContent) === 'string')
                                $this.listContainer.append('<li class="pui-datascroller-item">' + itemContent + '</li>');
                            else
                                $this.listContainer.append($('<li class="pui-datascroller-item"></li>').wrapInner(itemContent));
                        }
                        offset += $this.options.chunksize;
                        if(offset === totalSize) {
                            $this.allLoaded = true;
                            $this.loading = false;
                            $this.loadStatus.remove();
                        } 
                    }
                });
            }
        },
        _manuelLoad:function() {
            var $this = this,
            offset = $this.options.initchunk,
            totalSize = $this.options.datasource.length;
        
            this.loadTrigger.on('click.dataScroller', function(e) {
                if(offset !== totalSize) {
                    for (var i = offset; i < offset + $this.options.chunksize; i++) {
                        var itemContent = $this.options.content.call(this,$this.options.datasource[i]);
                        if($.type(itemContent) === 'string')
                            $this.listContainer.append('<li class="pui-datascroller-item">' + itemContent + '</li>');
                        else
                            $this.listContainer.append($('<li class="pui-datascroller-item"></li>').wrapInner(itemContent));
                    }
                    offset += $this.options.chunksize;
                }
                e.preventDefault();
            });
        },
        shouldLoad: function() {
            return (!this.loading && !this.allLoaded);
        }
        
    });
})();
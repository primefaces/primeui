/**
 * PrimeUI inputtext widget
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

    $.widget("primeui.puifileupload", {
       
        options: {
            mode: 'advanced',
            chooseLabel: 'Choose',
            uploadLabel: 'Upload',
            cancelLabel: 'Cancel',
            accept: null,
            multiple: false,
            auto: false,
            url: null,
            maxFileSize: null,
            name: null,
            previewWidth: 50,
            withCredentials: false,
            disabled: false,
            invalidFileSizeMessageSummary: '{0}: Invalid file size, ',
            invalidFileSizeMessageDetail: 'maximum upload size is {0}.'
        },
       
        _create: function() {
            this.files = [];
            
            this._render();
            this._bindEvents();
        },
        
        _render: function() {
            this.element.addClass('ui-fileupload ui-widget')
                        .append('<div class="ui-fileupload-buttonbar ui-widget-header ui-corner-top">' + 
                                    '<span data-icon="fa-plus" class="ui-fileupload-choose">' + this.options.chooseLabel +'</span>' + 
                                '</div>' + 
                                '<div class="ui-fileupload-content ui-widget-content ui-corner-bottom">' + 
                                    '<div class="ui-fileupload-progressbar"></div>' + 
                                    '<div class="ui-fileupload-messages"></div>' + 
                                    '<div class="ui-fileupload-files"></div>' + 
                                '</div>');
            
            //header
            this.bar = this.element.children('.ui-fileupload-buttonbar');
            if(!this.options.auto) {
                this.bar.append('<button data-icon="fa-upload" type="button" class="ui-fileupload-upload" disabled>' + this.options.uploadLabel + '</button>' + 
                                '<button data-icon="fa-close" type="button" class="ui-fileupload-cancel" disabled>' + this.options.cancelLabel + '</button>');
            }
            
            this.bar.children().puibutton();
            this.chooseButton = this.bar.children('.ui-fileupload-choose');
            this.uploadButton = this.bar.children('.ui-fileupload-upload');
            this.cancelButton = this.bar.children('.ui-fileupload-cancel');
            this._createInput();
            
            //content
            this.content = this.element.children('.ui-fileupload-content');
            this.filesListElement = this.content.children('.ui-fileupload-files');
            this.messagesElement = this.content.children('.ui-fileupload-messages').puimessages();
            this.progressBar = this.content.children('.ui-fileupload-progressbar').puiprogressbar();
            
            if(this.options.disabled) {
                this._disable();
            }
        },
                
        _createInput: function() {
            var $this = this;
            
            if(this.input) {
                this.input.off('change.puifileupload focus.puifileupload blur.puifileupload').remove();
            }
            
            this.input = $('<input type="file">').prependTo(this.chooseButton)
            .attr({
                'multiple': this.options.multiple ? 'multiple' : null,
                'accept': this.options.accept
            })
            .on('change.puifileupload', function(e) {
                $this._onFileSelect(e);
            })
            .on('focus.puifileupload', function(e) {
                $this.chooseButton.addClass('ui-state-focus');
            })
            .on('blur.puifileupload', function(e) {
                $this.chooseButton.removeClass('ui-state-focus');
            });
        },
        
        _bindEvents: function() {
            var $this = this;

            this.uploadButton.on('click.puifileupload', function(e) {
                $this.upload(e);
            });
            
            this.cancelButton.on('click.puifileupload', function(e) {
                $this.clear();
            });
            
            this.content.on('dragenter.puifileupload', function(e) {
                $this.onDragEnter(e);
            }).on('dragover.puifileupload', function(e) {
                $this.onDragOver(e);
            }).on('dragleave.puifileupload', function(e) {
                $this.onDragLeave(e);
            }).on('drop.puifileupload', function(e) {
                $this.onDrop(e);
            });
        },
        
        _unbindEvents: function() {
            this.input.off('change.puifileupload focus.puifileupload blur.puifileupload');
            this.uploadButton.off('click.puifileupload');
            this.cancelButton.off('click.puifileupload');
            this.bar.off('dragenter.puifileupload dragover.puifileupload dragleave.puifileupload drop.puifileupload')
        },
        
        _onFileSelect: function(event) {
            this.messagesElement.puimessages('clear');
            var files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            
            for(var file in files) {
                if(!this._isFileSelected(file)) {
                    if(this._validate(file)) {
                        if(this._isImage(file)) {
                            file.objectURL = window.URL.createObjectURL(file);
                        }

                        this.files.push(file);
                        this.renderFile(file);
                    }
                }
            }
                    
            if(this.options.onSelect) {
                this._trigger('onSelect', event, files);
            }
            
            this._refreshInputElement();
            
            if(this.files) {
                if(this.options.auto)
                    this.upload();
                else
                    this._enableButtons();
            }
        },
        
        renderFile: function(file) {
            var $this = this;
            var fileRow = $('<div class="ui-fileupload-row"></div>');
            
            if(this._isImage(file)) {
                var preview = $('<img>');
                preview.attr({
                    alt: file.name,
                    role: 'presentation',
                    src: file.objectURL,
                    width: this.options.previewWidth
                })
                .wrap('<div></div>');
                
                fileRow.append(preview.parent());
            }
            
            fileRow.append('<div>' + file.name + '</div>')
                    .append('<div>' + this._formatSize(file.size) + '</div>');

            this.filesListElement.append(fileRow);
            
            var removeButton = $('<button type="button" data-icon="fa-close"></button>').on('click.puifileupload', function(e) {
                $this._remove($(e.target).parent().index());
            }).puibutton().wrap('<div></div>');
            fileRow.append(removeButton.parent());
        },
        
        _isFileSelected: function(file) {
            for(var sFile in this.files){
                if((sFile.name + sFile.type + sFile.size) === (file.name + file.type + file.size))
                    return true;
            }
            
            return false;
        },

        _validate: function(file) {
            if(this.options.maxFileSize && file.size > this.options.maxFileSize) {
                this.messagesElement.puimessages('show', 'error', {
                    summary: this.options.invalidFileSizeMessageSummary.replace('{0}', file.name), 
                    detail: this.options.invalidFileSizeMessageDetail.replace('{0}', this._formatSize(this.options.maxFileSize))
                });
                return false;
            }
            
            return true;
        },
        
        hasFiles: function() {
            return this.files && this.files.length > 0;
        },

        upload: function() {
            this.messagesElement.puimessages('clear');
            var xhr = new XMLHttpRequest();
            var formData = new FormData();
            var $this = this;

            this._trigger('onBeforeUpload', null, {'xhr': xhr, 'formData': formData});
    		
            for(var file in this.files) {
                formData.append(this.options.name, file, file.name);
            }

            xhr.upload.addEventListener('progress', function(event) {
                if(event.lengthComputable) {
                    $this.progressBar.puiprogressbar('option', 'value', Math.round((event.loaded * 100) / event.total));
                }
                
                this._trigger('onProgress', event, {progress: this.progress});
            });

            xhr.onreadystatechange( function(){
                if(xhr.readyState === 4) {
                   $this.progressBar.puiprogressbar('option', 'value', 0);
                    
                    if(xhr.status >= 200 && xhr.status < 300) {
                        $this._trigger('onUpload', null, {xhr: xhr, files: $this.files});
                    }
                    else {
                        if(this.options.onError) {
                            $this._trigger('onUpload', null, {xhr: xhr, files: $this.files});
                        }
                    }

                    $this.clear();
                }
            });
            
            xhr.open('POST', this.options.url, true);
    		
            this._trigger('onBeforeSend', null, {'xhr': xhr, 'formData': formData});
                        
            xhr.withCredentials = this.options.withCredentials;
            
            xhr.send(formData);
        },

        clear: function() {
            var $this = this;
            this.files = [];
            this.filesListElement.children().fadeOut('normal', function() {$(this.remove())});
            this._trigger('onClear');
            this._refreshInputElement();
            this._disableButtons();
        },
        
        _disableButtons: function() {
            if(!this.options.auto) {
                this.uploadButton.puibutton('option', 'disabled', true);
                this.cancelButton.puibutton('option', 'disabled', true);
            }
        },
        
        _enableButtons: function() {
            if(!this.options.auto) {
                this.uploadButton.puibutton('option', 'disabled', false);
                this.cancelButton.puibutton('option', 'disabled', false);
            }
        },
        
        _remove: function(index) {
            this._refreshInputElement();
            this.files.splice(index, 1);
            this.filesListElement.children().eq(index).fadeOut('normal', function() {$(this.remove())});
            if(this.files.length === 0) {
                this._disableButtons();
            }
        },
        
        _isImage: function(file) {
            return /^image\//.test(file.type);
        },
        
        _refreshInputElement: function() {
            this._createInput();
        },

        _formatSize: function(bytes) {
            if(bytes === 0) {
                return '0 B';
            }
            var k = 1000,
            dm = 3,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        
        onDragEnter: function(event) {
            if(this._isEnabled()) {
                event.stopPropagation();
                event.preventDefault();
            }
        },
        
        onDragOver: function(event) {
            if(this._isEnabled()) {
                this.content.addClass('ui-fileupload-highlight');
                event.stopPropagation();
                event.preventDefault();
            }
        },
        
        onDragLeave: function(event) {
            this.content.removeClass('ui-fileupload-highlight');
        },
        
        onDrop: function(event) {
            if(this._isEnabled()) {
                this.content.removeClass('ui-fileupload-highlight');
                event.stopPropagation();
                event.preventDefault();
                
                var files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
                var allowDrop = this.options.multiple||(files && files.length === 1);
                
                if(allowDrop) {
                    this._onFileSelect(event);
                }
            }
        },
        
        disable: function() {
            this.input.prop('disabled', true);
            this.chooseButton.puibutton('disable');
            this._disableButtons();
        },
        
        enable: function() {
            this.input.prop('disabled', false);
            this.chooseButton.puibutton('enable');
        },
        
        _setOption: function(key, value) {
            if(key === 'disabled') {
                if(value)
                    this.disable();
                else
                    this.enable();
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
        
        _isEnabled: function() {
            return !this.chooseButton.prop('disabled');
        },
        
        _destroy: function() {
            this._unbindEvents();
            this.element.removeClass('ui-fileupload ui-widget');
            this.element.empty();
        }
        
    });
    
}));
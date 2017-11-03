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
        },
        
        _unbindEvents: function() {
            this.input.off('change.puifileupload');
            this.uploadButton.off('click.puifileupload');
            this.cancelButton.off('click.puifileupload');
        },
        
        _onFileSelect: function(event) {
            this.messagesElement.puimessages('clear');
            var files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            
            for(var file of files) {
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
            for(var sFile of this.files){
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
            let xhr = new XMLHttpRequest();
            let formData = new FormData();
            var $this = this;

            this._trigger('onBeforeUpload', null, {'xhr': xhr, 'formData': formData});
    		
            for(var file of this.files) {
                formData.append(this.options.name, file, file.name);
            }

            xhr.upload.addEventListener('progress', (event) => {
                if(event.lengthComputable) {
                    $this.progressBar.puiprogressbar('option', 'value', Math.round((event.loaded * 100) / event.total));
                }
                
                this._trigger('onProgress', event, {progress: this.progress});
            });

            xhr.onreadystatechange = () => {
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
            };
            
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
        
        _remove(index) {
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
            let k = 1000,
            dm = 3,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        
        _destroy: function() {
            this.element.removeClass('ui-inputtext ui-widget ui-state-default ui-state-disabled ui-corner-all');
            this._disableMouseEffects();
        }
        
    });
    
}));
/**
 * PrimeUI Terminal widget
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

    $.widget("primeui.puiterminal", {
       
        options: {
            welcomeMessage: '',
            prompt:'prime $',
            handler: null
        },
        
        _create: function() {
            this.element.addClass('ui-terminal ui-widget ui-widget-content ui-corner-all')
                        .append('<div>' + this.options.welcomeMessage + '</div>')
                        .append('<div class="ui-terminal-content"></div>')
                        .append('<div><span class="ui-terminal-prompt">' + this.options.prompt + '</span>' +
                                 '<input type="text" class="ui-terminal-input" autocomplete="off"></div>' );
                         
            this.promptContainer = this.element.find('> div:last-child > span.ui-terminal-prompt');
            this.content = this.element.children('.ui-terminal-content');
            this.input = this.promptContainer.next();
            this.commands = [];
            this.commandIndex = 0;
            
            this._bindEvents();
        },
                
        _bindEvents: function() {
            var $this = this;

            this.input.on('keydown.terminal', function(e) {
                var keyCode = $.ui.keyCode;

                switch(e.which) {
                    case keyCode.UP:
                        if($this.commandIndex > 0) {
                            $this.input.val($this.commands[--$this.commandIndex]);
                        }

                        e.preventDefault();
                    break;

                    case keyCode.DOWN:
                        if($this.commandIndex < ($this.commands.length - 1)) {
                            $this.input.val($this.commands[++$this.commandIndex]);
                        }
                        else {
                            $this.commandIndex = $this.commands.length;
                            $this.input.val('');
                        }

                        e.preventDefault();
                    break;

                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        $this._processCommand();

                        e.preventDefault();
                    break;
                }
            });
            
            this.element.on('click', function() {
                $this.input.trigger('focus');
            });
        },
                
        _processCommand: function() {
            var command = this.input.val();
            this.commands.push();
            this.commandIndex++;

            if(this.options.handler && $.type(this.options.handler) === 'function') {
                this.options.handler.call(this, command, this._updateContent); 
            }
        },

        _updateContent: function(content) {
            var commandResponseContainer = $('<div></div>');
            commandResponseContainer.append('<span>' + this.options.prompt + '</span><span class="ui-terminal-command">' +  this.input.val() + '</span>')
                                    .append('<div>' + content + '</div>').appendTo(this.content);

            this.input.val('');
            this.element.scrollTop(this.content.height());
        },

        clear: function() {
            this.content.html('');
            this.input.val('');
        }                       
    });
    
}));
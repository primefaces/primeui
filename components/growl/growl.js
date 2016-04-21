/**
 * PrimeFaces Growl Widget
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

    $.widget("primeui.puigrowl", {

        options: {
            sticky: false,
            life: 3000,
            messages: null,
            appendTo: document.body
        },

        _create: function() {
            var container = this.element;
            this.originalParent = this.element.parent();

            container.addClass("ui-growl ui-widget");

            if(this.options.appendTo) {
                container.appendTo(this.options.appendTo);
            }

            if(this.options.messages) {
                this.show(this.options.messages);
            }
        },

        show: function(msgs) {
            var $this = this;

            this.element.css('z-index', ++PUI.zindex);

            this.clear();

            if(msgs && msgs.length) {
                $.each(msgs, function(i, msg) {
                    $this._renderMessage(msg);
                });
            }
        },

        clear: function() {
            var messageElements = this.element.children('div.ui-growl-item-container');
            for(var i = 0; i < messageElements.length; i++) {
                this._unbindMessageEvents(messageElements.eq(i));
            }

            messageElements.remove();
        },

        _renderMessage: function(msg) {
            var markup = '<div class="ui-growl-item-container ui-state-highlight ui-corner-all ui-helper-hidden" aria-live="polite">';
            markup += '<div class="ui-growl-item ui-shadow">';
            markup += '<div class="ui-growl-icon-close fa fa-close" style="display:none"></div>';
            markup += '<span class="ui-growl-image fa fa-2x ' + this._getIcon(msg.severity) + ' ui-growl-image-' + msg.severity + '"/>';
            markup += '<div class="ui-growl-message">';
            markup += '<span class="ui-growl-title">' + msg.summary + '</span>';
            markup += '<p>' + (msg.detail||'') + '</p>';
            markup += '</div><div style="clear: both;"></div></div></div>';

            var message = $(markup);
            
            message.addClass('ui-growl-message-' + msg.severity);

            this._bindMessageEvents(message);
            
            message.appendTo(this.element).fadeIn();
        },

        _removeMessage: function(message) {
            message.fadeTo('normal', 0, function() {
                message.slideUp('normal', 'easeInOutCirc', function() {
                    message.remove();
                });
            });
        },

        _bindMessageEvents: function(message) {
            var $this = this,
                sticky = this.options.sticky;

            message.on('mouseover.puigrowl', function() {
                    var msg = $(this);

                    if(!msg.is(':animated')) {
                        msg.find('div.ui-growl-icon-close:first').show();
                    }
                })
                .on('mouseout.puigrowl', function() {
                    $(this).find('div.ui-growl-icon-close:first').hide();
                });

            //remove message on click of close icon
            message.find('div.ui-growl-icon-close').on('click.puigrowl',function() {
                $this._removeMessage(message);

                if(!sticky) {
                    window.clearTimeout(message.data('timeout'));
                }
            });

            if(!sticky) {
                this._setRemovalTimeout(message);
            }
        },

        _unbindMessageEvents: function(message) {
            var $this = this,
                sticky = this.options.sticky;

            message.off('mouseover.puigrowl mouseout.puigrowl');
            message.find('div.ui-growl-icon-close').off('click.puigrowl');
            if(!sticky) {
                var timeout = message.data('timeout');
                if(timeout) {
                    window.clearTimeout(timeout);
                }
            }
        },

        _setRemovalTimeout: function(message) {
            var $this = this;

            var timeout = window.setTimeout(function() {
                $this._removeMessage(message);
            }, this.options.life);

            message.data('timeout', timeout);
        },

        _getIcon: function(severity) {
            switch(severity) {
                case 'info':
                    return 'fa-info-circle';
                    break;

                case 'warn':
                    return 'fa-warning';
                    break;

                case 'error':
                    return 'fa-close';
                    break;

                default:
                    return 'fa-info-circle';
                    break;
            }
        },

        _setOption: function(key, value) {
            if(key === 'value' || key === 'messages') {
                this.show(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        _destroy: function() {
            this.clear();
            this.element.removeClass("ui-growl ui-widget");

            if(this.options.appendTo) {
                this.element.appendTo(this.originalParent);
            }
        }
    });
    
}));
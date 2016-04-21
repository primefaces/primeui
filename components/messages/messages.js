/**
 * PrimeUI Messages widget
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

    $.widget("primeui.puimessages", {
       
        options: {
            closable: true
        },

        _create: function() {
            this.element.addClass('ui-messages ui-widget ui-corner-all');
            if(this.options.closable) {
                this.closer = $('<a href="#" class="ui-messages-close"><i class="fa fa-close"></i></a>').appendTo(this.element);
            }
            this.element.append('<span class="ui-messages-icon fa fa-2x"></span>');
            
            this.msgContainer = $('<ul></ul>').appendTo(this.element);
            
            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;
            if(this.options.closable) {
                this.closer.on('click', function(e) {
                    $this.element.slideUp();
                    e.preventDefault();
                });
            }
        },

        show: function(severity, msgs) {
            this.clear();
            this.element.removeClass('ui-messages-info ui-messages-warn ui-messages-error').addClass('ui-messages-' + severity);
            
            this.element.children('.ui-messages-icon').removeClass('fa-info-circle fa-close fa-warning').addClass(this._getIcon(severity));
            
            if($.isArray(msgs)) {
                for(var i = 0; i < msgs.length; i++) {
                    this._showMessage(msgs[i]);
                }
            }
            else {
                this._showMessage(msgs);
            }
            
            this.element.show();
        },
        
        _showMessage: function(msg) {
            this.msgContainer.append('<li><span class="ui-messages-summary">' + msg.summary + '</span><span class="ui-messages-detail">' + msg.detail + '</span></li>');
        },
        
        clear: function() {
            this.msgContainer.children().remove();
            this.element.hide();
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
        }
        
    });
    
}));
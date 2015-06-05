/**
 * PrimeUI Messages widget
 */
$(function() {

    $.widget("primeui.puimessages", {
       
        options: {
            closable: true
        },

        _create: function() {
            this.element.addClass('pui-messages ui-widget ui-corner-all');
            if(this.options.closable) {
                this.closer = $('<a href="#" class="pui-messages-close"><i class="fa fa-close"></i></a>').appendTo(this.element);
            }
            this.element.append('<span class="pui-messages-icon fa fa-info-circle fa-2x"></span>');
            
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
            this.element.removeClass('pui-messages-info pui-messages-warn pui-messages-error').addClass('pui-messages-' + severity);
            
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
            this.msgContainer.append('<li><span class="pui-messages-summary">' + msg.summary + '</span><span class="pui-messages-detail">' + msg.detail + '</span></li>');
        },
        
        clear: function() {
            this.msgContainer.children().remove();
            this.element.hide();
        }
        
    });
    
});
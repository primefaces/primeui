/**
 * PrimeFaces Growl Widget
 */
$(function() {

    $.widget("primeui.puigrowl", {
       
        options: {
            sticky: false,
            life: 3000
        },
        
        _create: function() {
            var container = this.element;
            
            container.addClass("pui-growl ui-widget").appendTo(document.body);
        },
        
        show: function(msgs) {
            var $this = this;
        
            //this.jq.css('z-index', ++PrimeFaces.zindex);

            this.clear();

            $.each(msgs, function(i, msg) {
                $this._renderMessage(msg);
            }); 
        },
        
        clear: function() {
            this.element.children('div.pui-growl-item-container').remove();
        },
        
        _renderMessage: function(msg) {
            var markup = '<div class="pui-growl-item-container ui-state-highlight ui-corner-all ui-helper-hidden" aria-live="polite">';
            markup += '<div class="pui-growl-item pui-shadow">';
            markup += '<div class="pui-growl-icon-close ui-icon ui-icon-closethick" style="display:none"></div>';
            markup += '<span class="pui-growl-image pui-growl-image-' + msg.severity + '" />';
            markup += '<div class="pui-growl-message">';
            markup += '<span class="pui-growl-title">' + msg.summary + '</span>';
            markup += '<p>' + (msg.detail||'') + '</p>';
            markup += '</div><div style="clear: both;"></div></div></div>';

            var message = $(markup);
            
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
                    msg.find('div.pui-growl-icon-close:first').show();
                }
            })
            .on('mouseout.puigrowl', function() {        
                $(this).find('div.pui-growl-icon-close:first').hide();
            });

            //remove message on click of close icon
            message.find('div.pui-growl-icon-close').on('click.puigrowl',function() {
                $this._removeMessage(message);

                if(!sticky) {
                    window.clearTimeout(message.data('timeout'));
                }
            });

            if(!sticky) {
                this._setRemovalTimeout(message);
            }
        },
        
        _setRemovalTimeout: function(message) {
            var $this = this;

            var timeout = window.setTimeout(function() {
                $this._removeMessage(message);
            }, this.options.life);

            message.data('timeout', timeout);
        }
    });
});
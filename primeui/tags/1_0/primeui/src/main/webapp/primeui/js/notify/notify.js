/**
 * PrimeFaces Notify Widget
 */
$(function() {

    $.widget("primeui.puinotify", {
       
        options: {
            position: 'top',
            visible: false,
            animate: true,
            effectSpeed: 'normal',
            easing: 'swing'
        },
        
        _create: function() {
            this.element.addClass('pui-notify pui-notify-' + this.options.position + ' ui-widget ui-widget-content pui-shadow')
                    .wrapInner('<div class="pui-notify-content" />').appendTo(document.body);
            this.content = this.element.children('.pui-notify-content');
            this.closeIcon = $('<span class="ui-icon ui-icon-closethick pui-notify-close"></span>').appendTo(this.element);
            
            this._bindEvents();
            
            if(this.options.visible) {
                this.show();
            }
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.closeIcon.on('click.puinotify', function() {
                $this.hide();
            });
        },
        
        show: function(content) {
            var $this = this;
            
            if(content) {
                this.update(content);
            }
            
            this.element.css('z-index',++PUI.zindex);
            
            this._trigger('beforeShow');
            
            if(this.options.animate) {
                this.element.slideDown(this.options.effectSpeed, this.options.easing, function() {
                    $this._trigger('afterShow');
                });
            }
            else {
                this.element.show();
                $this._trigger('afterShow');
            }
        },

        hide: function() {
            var $this = this;
            
            this._trigger('beforeHide');
            
            if(this.options.animate) {
                this.element.slideUp(this.options.effectSpeed, this.options.easing, function() {
                    $this._trigger('afterHide');
                });
            }
            else {
                this.element.hide();
                $this._trigger('afterHide');
            }
        },
        
        update: function(content) {
            this.content.html(content);
        }
    });
});
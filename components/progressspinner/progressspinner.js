/**
 * PrimeUI progressspinner widget
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.widget("primeui.puiprogressspinner", {

        options: {
            strokeWidth: '2',
            fill: 'none',
            animationDuration: '2s'
        },

        _create: function() {
            this.element.addClass('ui-progress-spinner');
            this.svg = $('<svg class="ui-progress-spinner-svg" viewBox="25 25 50 50">' + 
                            '<circle class="ui-progress-spinner-circle" cx="50" cy="50" r="20" ' + + '/>' + 
                         '</svg>');
            this.circle = this.svg.children('circle');
            this.circle.attr({'fill': this.options.fill, 'stroke-width': this.options.strokeWidth});
            this.svg.appendTo(this.element);
        },

        _destroy: function() {
            this.svg = null;
            this.circle = null;
            this.element.removeClass('ui-progress-spinner').empty();
        }

    });

}));
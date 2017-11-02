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
            mode: 'advanced'
        },
       
        _create: function() {
            
        },
        
        _destroy: function() {
            this.element.removeClass('ui-inputtext ui-widget ui-state-default ui-state-disabled ui-corner-all');
            this._disableMouseEffects();
        }
        
    });
    
}));
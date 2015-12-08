(function() {
    
    var InputTextPrototype = Object.create(HTMLInputElement.prototype);
    
    InputTextPrototype.createdCallback = function() {
        $(this).puiinputtext();
    };
    
    InputTextPrototype.disable = function() {
        $(this).puiinputtext('disable');
    };
    
    InputTextPrototype.enable = function() {
        $(this).puiinputtext('enable');
    };
    
    document.registerElement('p-inputtext', {
        extends: 'input',
        prototype: InputTextPrototype
    });
    
})();
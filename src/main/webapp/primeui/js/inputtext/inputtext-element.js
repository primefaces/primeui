(function() {
    
    var InputTextPrototype = Object.create(HTMLInputElement.prototype);
    
    InputTextPrototype.createdCallback = function() {
        $(this).puiinputtext();
    };
    
    document.registerElement('p-inputtext', {
        extends: 'input',
        prototype: InputTextPrototype
    });
    
})();
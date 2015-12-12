var TerminalDemo = {
  
    handler: function(request, response) {
        $.ajax({
            type: "GET",
            url: 'rest/terminal/' + request,
            dataType: "text",
            context: this,
            success: function(data) {
                response.call(this, data);
            }
        });
    }
    
};
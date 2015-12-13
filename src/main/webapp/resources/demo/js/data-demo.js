var DataDemo = {
    
    loadAllCars: function (callback) {
        $.ajax({
            type: "GET",
            url: 'rest/cars/list',
            dataType: "json",
            context: this,
            success: function (response) {
                callback.call(this, response);
            }
        });
    }
    
}
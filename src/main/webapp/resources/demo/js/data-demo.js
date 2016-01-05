var DataDemo = {
    
    loadAllCars: function(callback) {
        $.ajax({
            type: "GET",
            url: 'rest/cars/list',
            dataType: "json",
            context: this,
            success: function (response) {
                callback.call(this, response);
            }
        });
    },
    
    loadLazyCars: function (callback, ui) {
        var uri = 'rest/cars/lazylist/' + ui.first;

        $.ajax({
            type: "GET",
            url: uri,
            dataType: "json",
            context: this,
            success: function (response) {
                callback.call(this, response);
            }
        });
    }
    
};
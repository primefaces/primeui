$(function() {
    $.getJSON("http://blog.primefaces.org/?cat=11&feed=json&jsonp=?", function(data) { 
		var latestNewsContainer = $('#latestNews'),
        entry = data[0];
        
        latestNewsContainer.prepend(entry.title);
        latestNewsContainer.children('.dispBlock').html(entry.excerpt);			
	}); 
});
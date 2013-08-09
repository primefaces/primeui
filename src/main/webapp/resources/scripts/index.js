$(function() {	
	$.getJSON("http://blog.primefaces.org/?cat=11&feed=json&jsonp=?", function(data) { 
		var news = $('#news'); 
			for(var i = 0; i < 2; i++) { 
				var entry = data[i],
				content = '<div class="post">';
				content += '<strong class="entry-title">' + entry.title + '</strong>';
				content += '<p>' + entry.excerpt + '</p>';
				content += '<div class="post-frame"><em class="date">' + entry.date + '</em></div>';
				content += '</div>';
				
				news.append(content);
			} 
	});
});
$(function() {
   $('#sidebar .widget-link:not(.ui-state-highlight)').hover(function(){
      $(this).toggleClass('ui-state-hover');
   }); 
});
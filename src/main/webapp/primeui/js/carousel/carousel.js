/**
 * PrimeUI Carousel Widget
 */
 var k = 0;
$(function() {
var items;

    $.widget("primeui.puicarousel", {
       
        options: {
            numVisible: 3,
      			firstVisible: 1,
      			effectDuration: 500,
      			circular: false,
      			responsive: false,
        },


        _create: function() {
          this.element.addClass("ui-carousel-items").css("height","250px");
          this.element.wrap("<div class='ui-carousel-viewport ui-carousel-inner'></div>");
          this.viewport = $( "<div>", { "class": "ui-carousel-header ui-widget-header ui-corner-all ui-carousel-inner"}).insertBefore($(".ui-carousel-viewport"));
          this.header = $( "<div>", {text : "Custom", "class": "ui-carousel-header-title"}).appendTo($(".ui-carousel-header"));
          $(".ui-carousel-inner").wrapAll("<div class='ui-carousel ui-widget ui-widget-content ui-corner-all'></div>");
          $(".ui-carousel li").addClass("ui-carousel-item ui-widget-content ui-corner-all");
          if (this.options.responsive == true){
            var countVisible = this.options.numVisible;
            function responsive(){
              var outer = $(".ui-carousel-viewport").outerWidth();
              var widthItem = outer/countVisible;
              $(".ui-carousel li").css("float","left")
              .css("width",widthItem)
              .css("text-align","center")
              .css("height","auto")
              .css("position","absolute");
              $(".ui-widget-content").css("100%");
              $( ".ui-carousel-item" ).each(function() {
                var id = $( this ).attr("id");
                $( this ).css("left", id * widthItem);
              });
            }
            responsive();
            $(window).resize(function(){
              responsive()
            });
              
          }else{
            $(".ui-widget-content").css("width",(this.options.numVisible*250)+"px");
            $(".ui-carousel li").css("float","left")
            .css("width","246px")
            .css("height","auto")
            .css("position","absolute");
            
          }

          this.nextBtn = $( "<span>", {
            "class": "ui-carousel-button ui-carousel-next-button ui-icon ui-icon-circle-triangle-e"
          })
          .appendTo( $(".ui-carousel-header") );

          

          this.prevBtn = $( "<span>", {
            "class": "ui-carousel-button ui-carousel-prev-button ui-icon ui-icon-circle-triangle-w"
          })
          .appendTo($(".ui-carousel-header"));

          this.items = $(".ui-carousel-item").length;
          var firstVisible = this.options.firstVisible - 1;
          var itemWidth = $(".ui-carousel-item").outerWidth();
            $( ".ui-carousel-item" ).each(function() {
            $( this ).attr("id", k);
            $( this ).css("left", k * itemWidth);
            if (k == 0){
              $( "#"+k ).addClass("first");
              
            }
            if(k == firstVisible){
              $( "#"+k ).addClass("current");
            }
            if ($(".ui-carousel-item").length-1 == k){
              $( "#"+k ).addClass("last");
            }
            k++;
          });

          this._setCurrentItem();
          this._on( this.nextBtn, {
            
            click: function() {this._nextClick(this.currentItem+this.options.numVisible)}
          });

          this._on( this.prevBtn, {
            
            click: function() {this._prevClick(this.currentItem-this.options.numVisible)}
          });
          var smt = this;
          this.visibleCount = this.options.numVisible;
          if(this.options.circular == true){
            this._circular()
          };

          return this;
        },

        

        
        _circular: function(){
          setInterval(function(){
            $(".ui-carousel-next-button").trigger( "click" );
          }, 3000);
        },

        _setCurrentItem: function(){
          

          this.currentItem = parseInt($(".current").attr("id"));

          
        },
       

        _nextClick: function( currItem ) {
              var itemWidth = $(".ui-carousel-item").outerWidth();
              if(currItem > this.items){
                var currItemIsLast = $("#"+(this.items-1)).hasClass("last");
              }else{
                var currItemIsLast = $("#"+(currItem-1)).hasClass("last");
              }
              if (!currItemIsLast){
                $(".ui-carousel-item").animate({
                  left: "-="+(itemWidth*this.options.numVisible)
                }, this.options.effectDuration) 
                $("#"+(currItem-this.options.numVisible)).removeClass("current");
                $("#"+currItem).addClass("current");
                this._setCurrentItem();
              }else{
                $(".ui-carousel-item").animate({
                  left: "-="+($(".first").css("left"))
                }, this.options.effectDuration) 
                $(".last").removeClass("current");
                $(".first").addClass("current");
                this._setCurrentItem();
              }
              this.return;
        },

        _prevClick: function( currItem ) {
              var itemWidth = $(".ui-carousel-item").outerWidth();
              if(currItem < 0){
                var currItemIsLast = $("#"+(0)).hasClass("first");
              }else{
                var currItemIsLast = $("#"+(currItem+1)).hasClass("first");
              }
              
              if (!currItemIsLast){
                $(".ui-carousel-item").animate({
                  left: "+="+(itemWidth*this.options.numVisible)
                }, this.options.effectDuration) 
                $("#"+(currItem+this.options.numVisible)).removeClass("current");
                $("#"+currItem).addClass("current");
                this._setCurrentItem();
              }
              this.return;
        }
        
    });
})
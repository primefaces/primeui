(function() {

    $.widget("primeui.puimultiselectlistbox", {
       
       options: {
            caption: null,
            choices: null,
            items: null,
            effect: false||'fade',
            showHeaders: false,
            name: null
        },
        
        _create: function() {
            this.element.addClass('pui-multiselectlistbox ui-widget ui-helper-clearfix');
            this.element.append('<input type="hidden"></input>');
            this.element.append('<div class="pui-multiselectlistbox-listcontainer"></div>');
            this.container = this.element.children('div');
            this.input = this.element.children('input');
            var choices = this.options.choices;
            if(this.options.name) {
                this.input.attr('name', this.options.name);
            }

            if(choices) {
                if(this.options.caption) {
                    this.container.append('<div class="pui-multiselectlistbox-header ui-widget-header ui-corner-top">'+ this.options.caption +'</div>');
                }
                
                this.container.append('<ul class="pui-multiselectlistbox-list pui-inputfield ui-widget-content ui-corner-bottom"></ul>');
                this.rootList = this.container.children('ul');
                
                for(var i = 0; i < choices.length; i++) {
                    this.rootList.append('<li class="pui-multiselectlistbox-item"><span> '+ this.options.choices[i].label +'</span></li>');
                }

                var listItems = $('li.pui-multiselectlistbox-item');

                for (var i = 0; i < choices.length; i++) {
                    this._createNestedListDom(choices[i], listItems[i]);  
                }
                
                this.items = this.element.find('li.pui-multiselectlistbox-item');
                this._bindEvents();
            }
        },
        
        _createNestedListDom: function(choices, element) {
            if(choices && choices.items) {
                var listElements = $(element);
                listElements.append('<ul class="ui-helper-hidden"></ul>');
                var ulElements = listElements.children('ul');

                for (var j = 0; j < choices.items.length; j++) {
                    var item = choices.items[j];
                    ulElements.append('<li class="pui-multiselectlistbox-item" data-value= "'+ item.value +'"><span> '+ item.label +'</span></li>');
                    this._createNestedListDom(choices.items[j],ulElements.children('li').get(j)); 
                }
            }            
        },
        
        _unbindEvents: function() {
           this.items.off('mouseover.multiSelectListbox mouseout.multiSelectListbox click.multiSelectListbox');
        },
        
        _bindEvents: function() {
           var $this = this;
           
           this.items.on('mouseover.multiSelectListbox', function() {
               var item = $(this);

               if(!item.hasClass('ui-state-highlight'))
                   $(this).addClass('ui-state-hover');
           })
           .on('mouseout.multiSelectListbox', function() {
               var item = $(this);

               if(!item.hasClass('ui-state-highlight'))
                   $(this).removeClass('ui-state-hover');
           })
           .on('click.multiSelectListbox', function() {
               var item = $(this);
               if(!item.hasClass('ui-state-highlight'))
                   $this.showOptionGroup(item);
           });
        },
        
        showOptionGroup: function(item) {
           item.addClass('ui-state-highlight').removeClass('ui-state-hover').siblings().filter('.ui-state-highlight').removeClass('ui-state-highlight');
           item.closest('.pui-multiselectlistbox-listcontainer').nextAll().remove();
           this.input.val(item.attr('data-value'));
           var childItemsContainer = item.children('ul');

           if(childItemsContainer.length) {
              var groupContainer = $('<div class="pui-multiselectlistbox-listcontainer" style="display:none"></div>');
              childItemsContainer.clone(true).appendTo(groupContainer).addClass('pui-multiselectlistbox-list pui-inputfield ui-widget-content').removeClass('ui-helper-hidden');

              if(this.options.showheader) {
                  groupContainer.prepend('<div class="pui-multiselectlistbox-header ui-widget-header ui-corner-top">' + item.children('span').text() + '</div>')
                  .children('.pui-multiselectlistbox-list').addClass('ui-corner-bottom');
              }
              else {
                  groupContainer.children().addClass('ui-corner-all');
                  groupContainer.children().css('margin-top', '22px');
              }

              this.element.append(groupContainer);

              if (this.options.effect)
                  groupContainer.show(this.options.effect);
              else
                  groupContainer.show();
            }
        },
        
        disable: function() {
           if(!this.options.disabled) {
               this.options.disabled = true;
               this.element.addClass('ui-state-disabled');
               this._unbindEvents();
               this.container.nextAll().remove();
           }
        }
    });
})();


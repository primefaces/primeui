(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.widget("primeui.puimultiselectlistbox", {
       
       options: {
            caption: null,
            choices: null,
            effect: false||'fade',
            name: null,
            value: null
        },
        
        _create: function() {
            this.element.addClass('ui-multiselectlistbox ui-widget ui-helper-clearfix');
            this.element.append('<input type="hidden"></input>');
            this.element.append('<div class="ui-multiselectlistbox-listcontainer"></div>');
            this.container = this.element.children('div');
            this.input = this.element.children('input');
            var choices = this.options.choices;
            if(this.options.name) {
                this.input.attr('name', this.options.name);
            }

            if(choices) {
                if(this.options.caption) {
                    this.container.append('<div class="ui-multiselectlistbox-header ui-widget-header ui-corner-top">'+ this.options.caption +'</div>');
                }
                
                this.container.append('<ul class="ui-multiselectlistbox-list ui-inputfield ui-widget-content ui-corner-bottom"></ul>');
                this.rootList = this.container.children('ul');
                
                for(var i = 0; i < choices.length; i++) {
                    this._createItemNode(choices[i], this.rootList);
                }
                
                this.items = this.element.find('li.ui-multiselectlistbox-item');
                this._bindEvents();
                
                if(this.options.value !== undefined || this.options.value !== null) {
                    this.preselect(this.options.value);
                }
            }
        },
        
        _createItemNode: function(choice, parent) {
            var listItem = $('<li class="ui-multiselectlistbox-item"><span>'+ choice.label + '</span></li>');
            listItem.appendTo(parent);
            
            if(choice.items) {
                listItem.append('<ul class="ui-helper-hidden"></ul>');
                var sublistContainer = listItem.children('ul');
                for(var i = 0; i < choice.items.length; i++) {
                    this._createItemNode(choice.items[i], sublistContainer);
                }
            }
            else {
                listItem.attr('data-value', choice.value);
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
               if(!item.hasClass('ui-state-highlight')) {
                   $this.showOptionGroup(item);
               }
           });
        },
        
        showOptionGroup: function(item) {
           item.addClass('ui-state-highlight').removeClass('ui-state-hover').siblings().filter('.ui-state-highlight').removeClass('ui-state-highlight');
           item.closest('.ui-multiselectlistbox-listcontainer').nextAll().remove();
           var childItemsContainer = item.children('ul'),
           itemValue = item.attr('data-value');
   
           if(itemValue) {
               this.input.val(itemValue);
           }

           if(childItemsContainer.length) {
              var groupContainer = $('<div class="ui-multiselectlistbox-listcontainer" style="display:none"></div>');
              childItemsContainer.clone(true).appendTo(groupContainer).addClass('ui-multiselectlistbox-list ui-inputfield ui-widget-content').removeClass('ui-helper-hidden');

              groupContainer.prepend('<div class="ui-multiselectlistbox-header ui-widget-header ui-corner-top">' + item.children('span').text() + '</div>')
                  .children('.ui-multiselectlistbox-list').addClass('ui-corner-bottom');

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
        },
        
        getValue: function() {
            return this.input.val();
        },

        preselect: function(value) {
            var $this = this,
            item = this.items.filter('[data-value="' + value + '"]');

            if(item.length === 0) {
                return;
            }

            var ancestors = item.parentsUntil('.ui-multiselectlistbox-list'),
            selectedIndexMap = [];

            for(var i = (ancestors.length - 1); i >= 0; i--) {
                var ancestor = ancestors.eq(i);

                if(ancestor.is('li')) {
                    selectedIndexMap.push(ancestor.index());
                }
                else if(ancestor.is('ul')) {
                    var groupContainer = $('<div class="ui-multiselectlistbox-listcontainer" style="display:none"></div>');
                    ancestor.clone(true).appendTo(groupContainer).addClass('ui-multiselectlistbox-list ui-widget-content ui-corner-all').removeClass('ui-helper-hidden');

                    groupContainer.prepend('<div class="ui-multiselectlistbox-header ui-widget-header ui-corner-top">' + ancestor.prev('span').text() + '</div>')
                           .children('.ui-multiselectlistbox-list').addClass('ui-corner-bottom').removeClass('ui-corner-all');

                    $this.element.append(groupContainer);
                }
            }

            //highlight item
            var lists = this.element.children('div.ui-multiselectlistbox-listcontainer'),
            clonedItem = lists.find(' > ul.ui-multiselectlistbox-list > li.ui-multiselectlistbox-item').filter('[data-value="' + value + '"]');
            clonedItem.addClass('ui-state-highlight');

            //highlight ancestors
            for(var i = 0; i < selectedIndexMap.length; i++) {
                lists.eq(i).find('> .ui-multiselectlistbox-list > li.ui-multiselectlistbox-item').eq(selectedIndexMap[i]).addClass('ui-state-highlight');
            }

            $this.element.children('div.ui-multiselectlistbox-listcontainer:hidden').show();
        }
    });
    
}));


/**
 * PrimeUI Carousel Widget
 */
$(function() {

    $.widget("primeui.puicarousel", {

        options: {
            numVisible: 3,
            firstVisible: 0,
            effectDuration: 500,
            circular: false,
            responsive: false,
            breakpoint: 400
        },

        templates: {
            element: $('<div class="pui-carousel ui-widget ui-widget-content ui-corner-all" />'),
            nav: $('<span class="pui-carousel-button ui-icon" />'),
            viewport: $('<div class="pui-carousel-viewport" />'),
            header: $('<div class="pui-carousel-header ui-widget-header ui-corner-all" />'),
            pageLink: $('<a class="ui-icon pui-carousel-page-link ui-icon-radio-off" href="#" style="display: block;" />'),
            pageLinksContainer: $('<div class="pui-carousel-page-links" />'),
            mobileDropdown: $('<select class="pui-carousel-mobiledropdown ui-widget ui-state-default ui-corner-left" />'),
            dropdownOption: $('<option />')
        },

        _create: function() {
            this.id = this.element.attr('id');
            this.element.removeAttr('id');

            var $itemsContainer = this.element.clone().addClass('pui-carousel-items');
            var $prevNav = this.templates.nav.clone().addClass('ui-icon-circle-triangle-w pui-carousel-prev-button');
            var $nextNav = this.templates.nav.clone().addClass('ui-icon-circle-triangle-e pui-carousel-next-button');

            this.itemsContainer = $itemsContainer;
            this.items = this.itemsContainer.children('li').addClass('pui-carousel-item ui-widget-content ui-corner-all');
            this.itemsCount = this.items.length;
            this.page = parseInt(this.options.firstVisible / this.options.numVisible);
            this.totalPages = Math.ceil(this.itemsCount / this.options.numVisible);
            this.first = this.options.firstVisible;
            this.columns = this.options.numVisible;
            var $pageLinksContainer = this.templates.pageLinksContainer.clone();
            var $mobileDropdown = this.templates.mobileDropdown.clone();

            for(var i = 0; i < this.totalPages; i++) {
                var $pageLink = this.templates.pageLink.clone();

                if(i === this.page) {
                    $pageLink.addClass('ui-icon-radio-on');
                }

                $pageLinksContainer.append($pageLink);
            }

            for(var i = 1; i <= this.itemsCount; i++) {
                var $dropdownOption = this.templates.dropdownOption.clone().attr('value', i).text(i);
                $mobileDropdown.append($dropdownOption);
            }

            this.viewport = this.templates.viewport.clone();
            this.header = this.templates.header.clone();
            this.prevNav = $prevNav;
            this.nextNav = $nextNav;
            this.pageLinks = $pageLinksContainer.children();
            this.mobileDropdown = $mobileDropdown;

            var $element = this.templates.element.clone()
                .append(this.header
                        .append($nextNav)
                        .append($prevNav)
                        .append($pageLinksContainer)
                        .append(this.mobileDropdown))
                .append(this.viewport
                        .append($itemsContainer))
                .data(this.element.data());

            this.element.replaceWith($element);
            this.element = $element;

            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            else {
                this.element.attr('id', this.id);
            }

            setTimeout(this._refreshDimensions.bind(this), 200);
            this._bindEvents();
        },

        /**
         * Switch to the page with given index
         */
        setPage: function(p) {
            if(p !== this.page && !this.itemsContainer.is(':animated')) {
                var $this = this;

                this.itemsContainer.animate({
                    left: -1 * (this.viewport.innerWidth() * p)
                },
                {
                    duration: this.options.effectDuration,
                    complete: function() {
                        $this.page = p;
                        $this.first = $this.page * $this.columns;
                        $this._updateNavs();
                    }
                });
            }
        },

        _bindEvents: function() {
            var $this = this;

            this.prevNav.click(function() {
                if($this.page !== 0) {
                    $this.setPage($this.page - 1);
                }
                else if($this.options.circular) {
                    $this.setPage($this.totalPages - 1);
                }
            });

            this.nextNav.click(function() {
                if($this.page !== $this.totalPages - 1) {
                    $this.setPage($this.page + 1);
                }
                else if ($this.options.circular) {
                    $this.setPage(0);
                }
            });

            if(this.pageLinks.length) {
                this.pageLinks.click(function(e) {
                    var a = $(this).index();
                    $this.setPage(a);
                    e.preventDefault();
                });
            }

            this.header.children('select').change(function() {
                $this.setPage(parseInt($(this).val()) - 1);
            });

            var resizeNS = 'resize.' + this.id;
            $(window).off(resizeNS).on(resizeNS, function() {
                $this._refreshDimensions()
            });
        },

        _updateNavs: function() {
            if(!this.options.circular) {
                if(this.page === 0) {
                    this.prevNav.addClass('ui-state-disabled');
                    this.nextNav.removeClass('ui-state-disabled');
                }
                else if(this.page === (this.totalPages - 1)) {
                    this.prevNav.removeClass('ui-state-disabled');
                    this.nextNav.addClass('ui-state-disabled');
                }
                else {
                    this.prevNav.removeClass('ui-state-disabled');
                    this.nextNav.removeClass('ui-state-disabled');
                }
            }

            if(this.mobileDropdown.length) {
                this.mobileDropdown.val(this.page + 1);
            }

            if(this.pageLinks.length) {
                this.pageLinks.filter('.ui-icon-radio-on').removeClass('ui-icon-radio-on');
                this.pageLinks.eq(this.page).addClass('ui-icon-radio-on');
            }
        },

        _calculateWidths: function() {
            var firstItem = this.items.eq(0);
            if(firstItem.length) {
                var itemFrameWidth = firstItem.outerWidth(true) - firstItem.width();
                this.items.width((this.viewport.innerWidth() - itemFrameWidth * this.columns) / this.columns);
            }
        },

        _refreshDimensions: function() {
            if(this.options.responsive) {
                var win = $(window);
                if(win.width() <= this.options.breakpoint) {
                    this.columns = 1;
                    this._calculateWidths();
                    this.totalPages = this.itemsCount;
                    this.mobileDropdown.show();
                    this.pageLinks.hide();
                }
                else {
                    this.columns = this.options.numVisible;
                    this._calculateWidths();
                    this.totalPages = Math.ceil(this.itemsCount / this.options.numVisible);
                    this.mobileDropdown.hide();
                    this.pageLinks.show();
                }

                this.page = parseInt(this.first / this.columns);
                this._updateNavs();
                this.itemsContainer.css('left', (-1 * this.viewport.innerWidth() * this.page));
            }
            else {
                this._calculateWidths();
                this.itemsContainer.css('left', (-1 * this.viewport.innerWidth() * this.page));
            }
        }

    });
});

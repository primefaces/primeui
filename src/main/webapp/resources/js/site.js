var winW=$(window).width();
var winH=$(window).height();

Showcase = {
            
    init: function() {
        this.menu = $('#MENUSIDE');
        this.hiddenMenuIcons = this.menu.find('> div > span.MenuSideMainLink > .hiddenIcons');
        this.hiddenLogo = $('#BlueLogo');
        this.menu.perfectScrollbar({
            wheelSpeed: 40,
            suppressScrollX:true
        });

        this.bindEvents();
        
        var hash = window.location.hash;
        if(hash) {
            this.openPageHash(hash);
        }
    },

    bindEvents: function() {
        this.menu.on("mouseenter", function() {
            Showcase.highlightMenu();
        })
        .on("mouseleave", function() {
            Showcase.unhighlightMenu();
        });
        
        $('#mobilemenu').on('change', function(e) {
            var url = $(this).val();
            if(url.length > 0) {
                window.location = url;
            }
        });
        
        this.menu.find('a.SubMenuLink').on('click', function(e) {
            var href = $(this).attr('href');
            Showcase.openPage(href);
            window.location.hash = href.substring(href.lastIndexOf('/'), href.indexOf('.html'));
            Showcase.hashChangeByLink = true;
            e.preventDefault();
        });
        
        $(window).on('hashchange', function (e) {
            if(!Showcase.hashChangeByLink) {
                var hash = window.location.hash;
                if(hash) {
                    Showcase.openPageHash(hash);
                }
            }
            else {
                Showcase.hashChangeByLink = false;
            }
        });
    },

    highlightMenu: function() {
        this.hiddenMenuIcons.animate({opacity:1}, 250);
        this.hiddenLogo.animate({opacity:1}, 250);
    },

    unhighlightMenu: function() {
        this.hiddenMenuIcons.animate({opacity:0}, 250);
        this.hiddenLogo.animate({opacity:0}, 250);
    },

    openSubMenu: function(header) {
        var headerJQ = $(header);

        if(this.activeSubSubMenu) {
            $(this.activeSubSubMenu).removeClass("openSubMenuLink");
            this.activeSubSubMenu = null;
        }

        if(this.activeMenu) {
            if(this.activeMenu === header) {
                headerJQ.removeClass('MenuSideMainLinkDark').next().slideUp(700,"easeInOutQuint");
                this.activeMenu = null;
            }
            else {
                $(this.activeMenu).removeClass('MenuSideMainLinkDark').next().slideUp(700,"easeInOutQuint");
                headerJQ.addClass("MenuSideMainLinkDark").next().slideDown(700,"easeInOutQuint");
                this.activeMenu = header;
            }
        }
        else {
            headerJQ.addClass("MenuSideMainLinkDark").next().slideDown(700,"easeInOutQuint");
            this.activeMenu = header;
        }
    },
    
    openPageHash: function(hash) {
        if(hash && hash.length > 1) {
            var plainHash = hash.substring(1),
            root = window.location.href.split('#')[0],
            url = root + plainHash + '.html';

            this.openPage(url);
        }
    },

    openPage: function(url) {
        $.get(url, function(content) {
            $('#widgetdemo').html(content);
        });
    }
};

$(function() {
    Showcase.init();
});
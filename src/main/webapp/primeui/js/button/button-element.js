if(!xtag.tags['p-button']) {

    xtag.register('p-button', {

        extends: 'button',

        accessors: {
            icon: {
                attribute: {}
            },
            iconPos: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function () {
                $(this).puibutton({
                    icon: this.icon,
                    iconPos: this.iconPos || 'left'
                });
            }
        },

        methods: {
            disable: function () {
                $(this).puibutton('disable');
            },
            enable: function () {
                $(this).puibutton('enable');
            }
        }

    });

}
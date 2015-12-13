if(!xtag.tags['p-dialog']) {
 
    xtag.register('p-dialog', {

        accessors: {
            draggable: {
                attribute:{}
            },
            resizable: {
                attribute:{}
            },
            location: {
                attribute:{}
            },
            minwidth: {
                attribute:{}
            },
            minheight: {
                attribute:{}
            },
            width: {
                attribute:{}
            },
            visible: {
                attribute:{}
            },
            modal: {
                attribute:{
                    boolean: true
                }
            },
            showeffect: {
                attribute: {}
            },
            hideeffect: {
                attribute:{}
            },
            effectspeed: {
                attribute:{}
            },
            closeonescape: {
                attribute:{}
            },
            rtl: {
                attribute:{
                    boolean: true
                }
            },
            closable: {
                attribute: {}
            },
            minimizable: {
                attribute: {
                    boolean: true
                }
            },
            maximizable: {
                attribute: {
                    boolean: true
                }
            },
            appendto: {
                attribute:{}
            },
            responsive: {
                attribute: {
                    boolean: true
                }
            },
            beforeshow: {
                attribute: {}
            },
            aftershow: {
                attribute: {}
            },
            minimize: {
                attribute: {}
            },
            maximize: {
                attribute: {}
            }
        },

        lifecycle: {
            created: function() {
                $(this).contents().wrapAll('<div></div>');
                this.xtag.container = $(this).children('div');
                
                var $this = this;
                $(this.xtag.container).puidialog({
                    title: this.title,
                    draggable: this.draggable ? JSON.parse(this.draggable) : true,
                    resizable: this.resizable ? JSON.parse(this.resizable) : true,
                    location: this.location||'center',
                    minWidth: this.minwidth||150,
                    minHeight: this.minheight||25,
                    height: this.height||'auto',
                    width: this.width||'300px',
                    visible: this.visible,
                    modal: this.modal,
                    showEffect: this.showeffect,
                    hideeffect: this.hideeffect,
                    effectSpeed: this.effectspeed||'normal',
                    closeOnEscape: this.closeoneescape ? JSON.parse(this.closeoneescape) : true,
                    rtl: this.rtl,
                    closable: this.closable ? JSON.parse(closable) : true,
                    minimizable: this.minimizable,
                    maximizable: this.maximizable,
                    appendTo: this.appendto,
                    responsive: this.responsive,
                    beforeShow: this.beforeshow ? function(event){PUI.executeFunctionByName($this.beforeshow, event);} : null,
                    afterShow: this.aftershow ? function(event){PUI.executeFunctionByName($this.aftershow, event);} : null,
                    minimize: this.minimize ? function(event){PUI.executeFunctionByName($this.minimize, event);} : null,
                    maximize: this.maximize ? function(event){PUI.executeFunctionByName($this.maximize, event);} : null
                });
            }
        },

        methods: {
            show: function() {
                $(this.xtag.container).puidialog('show');
            },
            hide: function() {
                $(this.xtag.container).puidialog('hide');
            }
        }
        
    });
    
}
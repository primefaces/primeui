if(!xtag.tags['p-datepicker']) {
 
    xtag.register('p-datepicker', {

        accessors: {
            weekheader: {
                attribute:{}
            },
            dateformat: {
                attribute:{}
            },
            firstday: {
                attribute:{}
            },
            isrtl: {
                attribute:{
                    boolean:true
                }
            },
            showmonthafteryear: {
                attribute:{
                    boolean:true
                }
            },
            yearsuffix: {
                attribute:{}
            },
            showon: {
                attribute:{}
            },
            showanim: {
                attribute:{}
            },
            showoptions: {
                attribute:{}
            },
            defaultdate: {
                attribute:{}
            },
            appendtext: {
                attribute:{}
            },
            buttontext: {
                attribute:{}
            },
            buttonimage: {
                attribute:{}
            },
            buttonimageOnly: {
                attribute:{
                    boolean:true
                }
            },
            hideifnoprevnext: {
                attribute:{
                    boolean:true
                }
            },
            navigationasdateformat: {
                attribute:{
                    boolean:true
                }
            },
            gotocurrent: {
                attribute:{
                    boolean:true
                }
            },
            changemonth: {
                attribute:{
                    boolean:true
                }
            },
            changeyear: {
                attribute:{
                    boolean:true
                }
            },
            yearrange: {
                attribute:{}
            },
            showothermonths: {
                attribute:{
                    boolean:true
                }
            },
            selectothermonths: {
                attribute:{
                    boolean:true
                }
            },
            showweek: {
                attribute:{
                    boolean:true
                }
            },
            calculateweek: {
                attribute:{}
            },
            shortyearcutoff: {
                attribute:{}
            },
            mindate: {
                attribute:{}
            },
            maxdate: {
                attribute:{}
            },
            duration: {
                attribute:{}
            },
            beforeshowday: {
                attribute:{}
            },
            beforeshow: {
                attribute:{}
            },
            onselect: {
                attribute:{}
            },
            onchangemonthyear: {
                attribute:{}
            },
            onclose: {
                attribute:{}
            },
            numberofmonths: {
                attribute:{}
            },
            showcurrentatpos: {
                attribute:{}
            },
            stepmonths: {
                attribute:{}
            },
            stepbigmonths: {
                attribute:{}
            },
            altfield: {
                attribute:{}
            },
            altformat: {
                attribute:{}
            },
            constraininput: {
                attribute:{}
            },
            showbuttonpanel: {
                attribute:{
                    boolean:true
                }
            },
            autosize: {
                attribute:{
                    boolean:true
                }
            },
            disabled: {
                attribute:{
                    boolean:true
                }
            },
            inline: {
                attribute:{
                    boolean:true
                }
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;

                if(this.inline) {
                    this.xtag.datepicker = $(this).append('<div></div>').children('div');
                }
                else {
                    this.xtag.datepicker = $(this).append('<input></input>').children('input');
                }

                this.xtag.datepicker.datepicker({
                    weekHeader: this.weekheader || 'Wk',
                    dateFormat: this.dateformat || 'mm/dd/yy',
                    firstDay: this.firstday ? parseInt(this.firstday) : 0,
                    isRTL: this.isrtl,
                    showMonthAfterYear: this.showmonthafteryear,
                    yearSuffix: this.yearsuffix || '',
                    showOn: this.showon || 'focus',
                    showAnim: this.showanim || 'fadeIn',
                    defaultDate: this.defaultdate || null,
                    appendText: this.appendtext || '',
                    buttonText: this.buttontext || '...',
                    buttonImage: this.buttonimage || '',
                    buttonImageOnly: this.buttonimageonly,
                    hideIfNoPrevNext: this.hideifnoprevnext,
                    navigationAsDateFormat: this.navigationasdateformat,
                    gotoCurrent: this.gotocurrent,
                    changeMonth: this.changemonth,
                    changeYear: this.changeyear,
                    yearRange: this.yearrange || 'c-10:c+10',
                    showOtherMonths: this.showothermonths,
                    selectOtherMonths: this.selectothermonths,
                    showWeek: this.showweek,
                    calculateWeek: this.calculateweek || undefined ,
                    shortYearCutoff: this.shortyearcutoff || '+10',
                    minDate: this.mindate || null,
                    maxDate: this.maxdate || null,
                    duration: this.duration || 'fast',
                    beforeShowDay: this.beforeshowday || null,
                    beforeShow: this.beforeshow || null,
                    onSelect: this.onselect ? function(event, value){;PUI.executeFunctionByName($this.onselect, event, value);} : null,
                    onChangeMonthYear: this.onchangeMonthYear ? function(event, value){;PUI.executeFunctionByName($this.onchangemonthyear, event, value);} : null,
                    onClose: this.onclose ? function(event, value){;PUI.executeFunctionByName($this.onclose, event, value);} : null,
                    numberOfMonths: this.numberofmonths ? parseInt(this.numberOfMonths) : 1,
                    showCurrentAtPos: this.showcurrentatpos ? parseInt(this.showCurrentAtPos) : 0,
                    stepMonths: this.stepmonths ? parseInt(this.stepMonths) : 1,
                    stepBigMonths: this.stepbigmonths ? parseInt(this.stepBigMonths) : 12,
                    altField: this.altfield ? document.getElementById(this.altField) : null,
                    altFormat: this.altformat || '',
                    constrainInput: this.constraininput !== null ? JSON.parse(this.constrainInput) : true,
                    showButtonPanel: this.showbuttonpanel,
                    autoSize: this.autosize,
                    disabled: this.disabled
                });

                if(this.showon == 'button' && !this.inline) {
                    var triggerButton = this.xtag.datepicker.siblings('.ui-datepicker-trigger:button');
                    triggerButton.html('').addClass('pui-button ui-widget ui-state-default ui-corner-all pui-button-icon-only')
                    .append('<span class="pui-button-icon-left pui-icon fa fa-calendar"></span><span class="pui-button-text">ui-button</span>');
                }
            }
        },

        methods: {
            disable: function() {
                this.xtag.container.datepicker('disable');
            },
            enable: function() {
                this.xtag.container.datepicker('enable');
            },
            destroy: function() {
                this.xtag.container.datepicker('destroy');
            }
        }
        
    });
    
}
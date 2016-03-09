if(!xtag.tags['p-datepicker']) {

    xtag.register('p-datepicker', {

        accessors: {
            altfield: {
                attribute:{}
            },
            altformat: {
                attribute:{}
            },
            autosize: {
                attribute:{
                    boolean:true
                }
            },
            beforeshow: {
                attribute:{}
            },
            beforeshowday: {
                attribute:{}
            },
            calculateweek: {
                attribute:{}
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
            constraininput: {
                attribute:{}
            },
            dateformat: {
                attribute:{}
            },
            defaultdate: {
                attribute:{}
            },
            disabled: {
                attribute:{
                    boolean:true
                }
            },
            duration: {
                attribute:{}
            },
            gotocurrent: {
                attribute:{
                    boolean:true
                }
            },
            hideifnoprevnext: {
                attribute:{
                    boolean:true
                }
            },
            inline: {
                attribute:{
                    boolean:true
                }
            },
            maxdate: {
                attribute:{}
            },
            mindate: {
                attribute:{}
            },
            navigationasdateformat: {
                attribute:{
                    boolean:true
                }
            },
            numberofmonths: {
                attribute:{}
            },
            onchangemonthyear: {
                attribute:{}
            },
            onclose: {
                attribute:{}
            },
            onselect: {
                attribute:{}
            },
            selectothermonths: {
                attribute:{
                    boolean:true
                }
            },
            shortyearcutoff: {
                attribute:{}
            },
            showanim: {
                attribute:{}
            },
            showbuttonpanel: {
                attribute:{
                    boolean:true
                }
            },
            showcurrentatpos: {
                attribute:{}
            },
            showon: {
                attribute:{}
            },
            showothermonths: {
                attribute:{
                    boolean:true
                }
            },
            showweek: {
                attribute:{
                    boolean:true
                }
            },
            stepmonths: {
                attribute:{}
            },
            yearrange: {
                attribute:{}
            },
            yearsuffix: {
                attribute:{}
            }
        },

        lifecycle: {
            created: function() {
                var $this = this;

                if(this.inline) {
                    this.xtag.container = $(this).append('<div></div>').children('div');
                }
                else {
                    this.xtag.container = $(this).append('<input />').children('input');
                }

                this.xtag.container.datepicker({
                    altField: this.altfield ? document.getElementById(this.altField): null,
                    altFormat: this.altformat||'',
                    autoSize: this.autosize,
                    beforeShow: this.beforeshow||null,
                    beforeShowDay: this.beforeshowday||null,
                    buttonText: '',
                    calculateWeek: this.calculateweek||undefined,
                    changeMonth: this.changemonth,
                    changeYear: this.changeyear,
                    constrainInput: this.constraininput !== null ? JSON.parse(this.constrainInput) : true,
                    defaultDate: this.defaultdate||null,
                    dateFormat: this.dateformat||'mm/dd/yy',
                    duration: this.duration||'fast',
                    gotoCurrent: this.gotocurrent,
                    hideIfNoPrevNext: this.hideifnoprevnext,
                    maxDate: this.maxdate||null,
                    minDate: this.mindate||null,
                    navigationAsDateFormat: this.navigationasdateformat,
                    numberOfMonths: this.numberofmonths ? parseInt(this.numberOfMonths) : 1,
                    onChangeMonthYear: this.onchangeMonthYear ? function(event, value){PUI.executeFunctionByName($this.onchangemonthyear, event, value);} : null,
                    onClose: this.onclose ? function(event, value){PUI.executeFunctionByName($this.onclose, event, value);} : null,
                    onSelect: this.onselect ? function(event, value){PUI.executeFunctionByName($this.onselect, event, value);} : null,
                    selectOtherMonths: this.selectothermonths,
                    shortYearCutoff: this.shortyearcutoff||'+10',
                    showAnim: this.showanim||'fadeIn',
                    showButtonPanel: this.showbuttonpanel,
                    showCurrentAtPos: this.showcurrentatpos ? parseInt(this.showCurrentAtPos) : 0,
                    showOn: this.showon||'focus',
                    showOtherMonths: this.showothermonths,
                    showWeek: this.showweek,
                    stepMonths: this.stepmonths ? parseInt(this.stepMonths) : 1,
                    yearSuffix: this.yearsuffix||'',
                    yearRange: this.yearrange||'c-10:c+10'
                });

                if(this.showon !== 'focus' && !this.inline) {
                    $(this).children('button').puibutton({icon:'fa fa-calendar'});
                }

                if(this.disabled) {
                    this.disable();
                }
            }
        },

        methods: {
            disable: function() {
                this.xtag.container.prop('disabled', true);
                if(this.showon !== 'focus' && !this.inline) {
                    this.xtag.container.siblings('.ui-datepicker-trigger:button').prop('disabled', true).addClass('ui-state-disabled');
                }
            },
            enable: function() {
                this.xtag.container.prop('disabled', false);
                if(this.showon !== 'focus' && !this.inline) {
                    this.xtag.container.siblings('.ui-datepicker-trigger:button').prop('disabled', false).removeClass('ui-state-disabled');
                }
            },
            getDate: function() {
                return this.xtag.container.datepicker('getDate');
            },
            setDate: function(date) {
                return this.xtag.container.datepicker('setDate', date);
            }
        }

    });

}
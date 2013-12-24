/**
 * PrimeUI password widget
 */
$(function() {

    $.widget("primeui.puipassword", {
        
        options: {
            promptLabel: 'Please enter a password',
            weakLabel: 'Weak',
            goodLabel: 'Medium',
            strongLabel: 'Strong',
            inline: false
        },
       
        _create: function() {
            this.element.puiinputtext().addClass('pui-password');
            
            if(!this.element.prop(':disabled')) {
                var panelMarkup = '<div class="pui-password-panel ui-widget ui-state-highlight ui-corner-all ui-helper-hidden">';
                panelMarkup += '<div class="pui-password-meter" style="background-position:0pt 0pt">&nbsp;</div>';
                panelMarkup += '<div class="pui-password-info">' + this.options.promptLabel + '</div>';
                panelMarkup += '</div>';

                this.panel = $(panelMarkup).insertAfter(this.element);
                this.meter = this.panel.children('div.pui-password-meter');
                this.infoText = this.panel.children('div.pui-password-info');

                if(this.options.inline) {
                    this.panel.addClass('pui-password-panel-inline');
                } else {
                    this.panel.addClass('pui-password-panel-overlay').appendTo('body');
                }

                this._bindEvents();
            }
        },
        
        _destroy: function() {
            this.panel.remove();
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.element.on('focus.puipassword', function() {
                $this.show();
            })
            .on('blur.puipassword', function() {
                $this.hide();
            })
            .on('keyup.puipassword', function() {
                var value = $this.element.val(),
                label = null,
                meterPos = null;

                if(value.length === 0) {
                    label = $this.options.promptLabel;
                    meterPos = '0px 0px';
                }
                else {
                    var score = $this._testStrength($this.element.val());

                    if(score < 30) {
                        label = $this.options.weakLabel;
                        meterPos = '0px -10px';
                    }
                    else if(score >= 30 && score < 80) {
                        label = $this.options.goodLabel;
                        meterPos = '0px -20px';
                    } 
                    else if(score >= 80) {
                        label = $this.options.strongLabel;
                        meterPos = '0px -30px';
                    }
                }

                $this.meter.css('background-position', meterPos);
                $this.infoText.text(label);
            });

            if(!this.options.inline) {
                var resizeNS = 'resize.' + this.element.attr('id');
                $(window).unbind(resizeNS).bind(resizeNS, function() {
                    if($this.panel.is(':visible')) {
                        $this.align();
                    }
                });
            }
        },

        _unbindEvents: function() {
            this.element.off('focus.puipassword blur.puipassword keyup.puipassword');
        },
        
        _testStrength: function(str) {
            var grade = 0, 
            val = 0, 
            $this = this;

            val = str.match('[0-9]');
            grade += $this._normalize(val ? val.length : 1/4, 1) * 25;

            val = str.match('[a-zA-Z]');
            grade += $this._normalize(val ? val.length : 1/2, 3) * 10;

            val = str.match('[!@#$%^&*?_~.,;=]');
            grade += $this._normalize(val ? val.length : 1/6, 1) * 35;

            val = str.match('[A-Z]');
            grade += $this._normalize(val ? val.length : 1/6, 1) * 30;

            grade *= str.length / 8;

            return grade > 100 ? 100 : grade;
        },

        _normalize: function(x, y) {
            var diff = x - y;

            if(diff <= 0) {
                return x / y;
            }
            else {
                return 1 + 0.5 * (x / (x + y/4));
            }
        },

        align: function() {
            this.panel.css({
                left:'', 
                top:'',
                'z-index': ++PUI.zindex
            })
            .position({
                my: 'left top',
                at: 'right top',
                of: this.element
            });
        },

        show: function() {
            if(!this.options.inline) {
                this.align();

                this.panel.fadeIn();
            }
            else {
                this.panel.slideDown(); 
            }        
        },

        hide: function() {
            if(this.options.inline) {
                this.panel.slideUp();
            }
            else {
                this.panel.fadeOut();
            }
        },

        disable: function () {
            this.element.puiinputtext('disable');
            this._unbindEvents();
        },

        enable: function () {
            this.element.puiinputtext('enable');
            this._bindEvents();
        }
    });
    
});
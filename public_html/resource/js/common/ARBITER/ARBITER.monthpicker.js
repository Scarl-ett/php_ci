ARBITER.declare('ARBITER.monthpicker', [], function(response) {
    
    var $ = jQuery;

    var currentPosition = 0;

    String.prototype.string = function(len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
    String.prototype.zf = function(len) { return "0".string(len - this.length) + this; };
    Number.prototype.zf = function(len) { return this.toString().zf(len); };
    
    $.fn.monthpicker = function(opts, callback){

        var opts = $.extend({}, $.fn.monthpicker.defaults, opts);

        var input = null;
        var curYear = null;
        var pop = $("<div style='z-index:99999999;'><div class='year'><span><a class='changeYear' data-amount='-1'>¢¸</a></span><strong id='curYear'></strong><span><a class='changeYear' data-amount='1'>¢º</a></span></div><ul id='monthList'></ul></div>").addClass("monthPicker");
        var monthList = pop.find("#monthList");

        for( var idx=1; idx<=12; idx++ ) monthList.append($("<li><a></a></li>").data("month", idx).find("a").text(idx+"¿ù").parent());

        pop.css({
            position : "absolute",
            top : opts.top ? this.offset().top+this.outerHeight()+2 : 0,
            left : this.offset().left,
            background : "#fff"
        });

        $("body").append(pop);

        this.click(function(){

            input = (opts.inputId != '') ? $('#'+opts.inputId) : $(this);

            curYear = $(this).val().split("-").length==2 ? $(this).val().split("-")[0] : new Date().getFullYear();
            $("#curYear").text(curYear+"³â");

            if (opts.top) {
                pop.css({
                    top : $(this).offset().top+$(this).outerHeight()+2,
                    left : $(this).offset().left
                });
            } else {
                pop.css({
                    top : 0,
                    left : $(this).offset().left
                });
            }

            pop.show();

            return false;
        });
        
        if (opts.autoHide) {
            pop.mouseleave(function(){
                pop.hide();
            });
        }
        
        pop.find(".changeYear").click(function(){
            curYear = parseInt(curYear,10) + parseInt($(this).data("amount"), 10);
            $("#curYear").text(curYear+"³â");
        });
        
        pop.find("#monthList li").click(function(){
            var sMonth = curYear + "-" + $(this).data("month").zf(2);

            input.val(sMonth);

            if (opts.parent) {
                parent.$('#oMonth').val(sMonth);
            }

            // Triggering the callback if set
            triggerCall(callback, sMonth);

            pop.hide();
        });

        function triggerCall(func, sMonth) {
            $.isFunction(func) && func.call(this, sMonth);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // DEFAULT VALUES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $.fn.monthpicker.defaults = {
        inputId   : '',
        autoHide  : true,
        top       : true,
        parent    : false,
    };

    response.implement = {};

});
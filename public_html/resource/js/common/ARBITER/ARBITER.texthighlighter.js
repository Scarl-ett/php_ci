ARBITER.declare('ARBITER.texthighlighter', [], function(response) {
    
    var $ = jQuery;
    
    var options = {
            
        // DEFAULT VALUES            
        color : "#FFFF00"
            
    };

    var public_methods = {
            
        getText : function() {

            if (typeof part != "undefined" && part != "") {
                var selectedWord = $(this).find("p:eq("+ (part-1) +") span[data-role=selected]");
            } else {
                var selectedWord = $(this).find("p span[data-role=selected]");
            }
            
            var ret = [];
            selectedWord.each(function() {
                ret.push({sentenceIdx: $(this).attr("data-sentence-index"), wordIdx:$(this).attr("data-index"), text : $(this).text()});
            });
            
            return ret;            
            
        },
        
        clear : function() {
            
            if (typeof part != "undefined" && part != "") {
                var selectedWord = $(this).find("p:eq("+ (part-1) +") span[data-role=selected]");
            } else {
                var selectedWord = $(this).find("p span[data-role=selected]");
            }
            
            var ret = [];
            selectedWord.each(function() {
                $(this).css("background-color","transparent");
                $(this).removeAttr("data-role");
            });
            
            return;
        },
        
        setWordSelected : function(arg) {
            
            var selectWord = arg[0];
            
            if(selectWord == "") return false;
            
            var word = $(this).find("p span");
            var aSelectWord = selectWord.split("//");
            
            var ret = [];
            word.each(function() {
                
                // 로직 구현.
                // 문장_단어index_단어 형식으로 넘어오는 것에 대한 선택.
                for(i=0; i<aSelectWord.length; i++)
                {
                    
                    var aWordData = aSelectWord[i].split("_");
                    if(($(this).attr("data-sentence-index") == aWordData[0]) && ($(this).attr("data-index") == aWordData[1]))
                    {
                        $(this).css("background-color", options.color);
                        $(this).attr("data-role", "selected");
                        break;
                    }
                }
                
                
                // $(this).css("background-color","transparent");
                // $(this).removeAttr("data-role");
            });
            
            return;
        }
    };
  
    $.fn.texthighlighter = function( options_or_method ){
 
        if ( public_methods[ options_or_method ] ) {
            
            return public_methods[ options_or_method ].call(this, Array.prototype.slice.call( arguments, 1 ));
            
        } else {
            
            options = $.extend(options, options_or_method);                        
            
            return this.each(function() {                
            
                // 이미 셋팅 되어있으면
                //if ($(this).attr("data-role") == "completed") return false;
                
                var idx = -1;
                var sentenceIdx = 0;
                
                $(this).find("p").each(function() {
                    
                    $(this).css('cursor', 'pointer');
                    sentenceIdx++;

                    var text = $.map($(this).text().split(" "), function(a) {
                        var word = $.trim(a);
                        
                        if (word != "") {
                            idx++;
                            return "<span data-sentence-index="+sentenceIdx+" data-index="+idx+">" + word + "</span>";
                        }
                    });
                    
                    $(this).html(text.join(" "));
                    
                    $(this).attr("data-role", "completed");
                });
                
                $(this).find("span").click(function () {
                    
                    switch($(this).attr("data-role"))
                    {
                        case "selectedWordSave" : 
                        case "title" : 
                        case "btnPackge" : 
                        case "clear-word" : 
                        case "latelyHwkSendList" : 
                        case "downMs" :
                        case "saveTop" :
                        break;
                        
                        case "selected" : 
                            $(this).css("background-color","transparent");
                            $(this).removeAttr("data-role");
                        break;
                        
                        default : 
                            $(this).css("background-color", options.color);
                            $(this).attr("data-role", "selected");
                        break;
                    }
                    /*
                    if ($(this).attr("data-role") == "selected") {
                        $(this).css("background-color","transparent");
                        $(this).removeAttr("data-role");
                    } else if ($(this).attr("data-role") != "selectedWordSave") {
                        $(this).css("background-color", options.color);
                        $(this).attr("data-role", "selected");
                    }
                    */
                });
            
            });                
        }
            
        // PRIVATE FUNCTION        
        function rgb2hex(rgb) {
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
             ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
        }                        
    };
    
    response.implement = {};
});
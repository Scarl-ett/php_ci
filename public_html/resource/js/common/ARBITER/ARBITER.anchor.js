/**
 * 책갈피 애니메이션
 * 
 * $("a.anchorLink").anchor();
 * 
 * <a href="#doc" class="anchorLink">본문</a>
 * <a name="doc" id="doc"></a>
 * 
 */
ARBITER.declare('ARBITER.anchor', [], function(response) {
    
    var $ = jQuery;

    var currentPosition = 0;

    $.fn.anchor = function(settings) {
        
        var settings = settings = $.extend({
            speed : 1100
        }, settings);    
        
        return $(this).each(function() {

            var caller = this
            $(caller).click(function (event) {    
                event.preventDefault()
                var locationHref = window.location.href
                var elementClick = $(caller).attr("href")
                
                var destination = $(elementClick).offset().top;
                $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, settings.speed, function() {
                    window.location.hash = elementClick
                });
                
                return false;
            })
        });
    };
    
    response.implement = {};

});
/**
 * 슬라이드 효과
 * 
 * $('[data-role=slides]').slide({LoopWay : 'next'}, function(currentPosition) {
 *     $('.step-number').eq(currentPosition-1).parent('li').removeClass('active');
 *     $('.step-number').eq(currentPosition).parent('li').addClass('active');
 * });
 */
ARBITER.declare('ARBITER.slide', [], function(response) {
    
    var $ = jQuery;

    var currentPosition = 0;

    $.fn.slide = function(options, callback) {
        
        var opts = $.extend({}, $.fn.slide.defaults, options);
        
        return $(this).each(function() {

            var $slides = $(this).find('.' + opts.slideId);        
            var $slidesInner = $(this).find('[data-role=slidesInner]');
            
            var numberOfSlides = $slides.length;
            
            if( opts.LoopWay == 'prev' )
            {
                currentPosition = currentPosition - 1;

                if(currentPosition <= 0 )
                {
                    currentPosition = 0;
                }
            }
            else
            {
                currentPosition = currentPosition + 1;
                
                if(currentPosition >= numberOfSlides - 1 )
                {
                    currentPosition = numberOfSlides - 1;
                }
            }

            $slidesInner.animate({
                'marginLeft' : parseInt($(this).css('width')) * (-currentPosition)
            }, function() {
                // Triggering the callback if set
                triggerCall(callback);
            });
            
            function triggerCall(func) {
                $.isFunction(func) && func.call($(this), currentPosition);
            }
        });
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // DEFAULT VALUES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $.fn.slide.defaults = {
        slideId : 'slide',
        LoopWay : 'next'
    };
    
    response.implement = {};

});
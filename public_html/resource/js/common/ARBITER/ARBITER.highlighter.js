ARBITER.declare('ARBITER.highlighter', ['ARBITER.util'], function(response) {
    
    var $ = jQuery;

    $.fn.highlighter = function(options) {
        
        var defaults = {
            screencolor    : 'black', 
            screenopacity  : '0.6',
            overlaycolor   : 'white',
            boxshadow      : '0px 0px 30px white',
            animationspeed : 0
        };
        var settings = $.extend({}, defaults, options);
        
        var top            = $(this).offset().top;
        var left           = $(this).offset().left;
        
        var width          = $(this).outerWidth();
        var height         = $(this).outerHeight();        
        
        // VARIABLES    
        var that           = this
          , browser        = ARBITER.util.browser()
          , d              = $(document)
          , w              = window
          , $w             = $(w)
          , prefix         = '__highlighter'          
          , cnts           = 0
          , id;
        
        // close
        that.close = function() {
            if (browser.name == 'msie' &&  (browser.version == '7.0' || browser.version == '6.0')) return;
            closer();
        };
        
        return that.each(function() {
            if (browser.name == 'msie' &&  (browser.version == '7.0' || browser.version == '6.0')) return;
            if ($(this).data('h_id')) return; // already exists?
            init();
        });// end each
        
        function init() {
            cnts = ($w.data('h_cnts') || 0) + 1, id = prefix + cnts + '__';
            showelement();
        }
        function showelement() {
            
            showbackground();
            
            that.data('h_id', id).wrap($('<div id="overlay"></div>'));
            
            $('#overlay').css({
                'background-color'   : settings.overlaycolor,
                'width'              : width,
                'height'             : height,
                'position'           :'absolute',
                'z-index'            : '101',
                'display'            : 'none',
                '-moz-box-shadow'    : settings.boxshadow,
                '-webkit-box-shadow' : settings.boxshadow
            }).fadeIn(settings.animationspeed).offset({left : left, top : top});            
            
            $w.data('h_cnts', cnts);
        };
        function showbackground() {
            if($("#screen").length  == 0){
                $("body").append('<div id="screen" class="'+id+'"></div>');
                $("#screen").css({
                    'width'            : '100%',
                    'height'           : '100%',
                    'top'              : '0px',
                    'left'             : '0px',
                    'position'         : 'fixed',
                    'background-color' : settings.screencolor,
                    'opacity'          : settings.screenopacity,
                    'z-index'          : '100',
                    'cursor'           : 'pointer'
                }).fadeIn(settings.animationspeed);
            }
        };        
        function closer() {
            
            $('.' + that.data('h_id')).fadeOut(settings.animationspeed, function() {
                $(this).remove();
            });
            
            that.unwrap();
            
            $w.data('h_cnts', ($w.data('h_cnts')-1 > 0) ? $w.data('h_cnts')-1 : null);
            that.data('h_id', null);
            
        };
        
    };
    
    response.implement = {};
});
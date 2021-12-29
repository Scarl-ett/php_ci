/**
 * 
   arbi.ajax(url, {
       data1 : data1,
       data2 : data2,
       data3 : data3          
   }, function(ret) {
       // callback function
   });        
 */
ARBITER.declare('ARBITER.ajax', ['ARBITER.layerpopup'], function(response) {

    var $ = jQuery;
    
    var modal;

    function ajax() {
        
        var args, execOpts;
        
        args = {
            url : arguments[0],
            data : arguments[1],
            success : arguments[2],
            options : arguments[3] || Object 
        };        
        
        execOpts = {
            type: 'POST',
            url: args.url,
            data: args.data,
            success: function() {
                if (typeof args.success == 'function') {
                    
                    if (args.options.block) {
                        modal.close();
                    }
                    
                    args.success.apply(this, arguments);                    
                    
                } else {
                    throw new Error('Cannot find callback function for \'' + args.url + '\' XHR.');    
                }
            }
        };
             
        if (args.options.block) {
            block();            
        }   
        
        $.ajax(execOpts);
    };    
    
    function block()
    {
        modal = ARBITER.layerpopup({
            /*
            id         : 'loading',
            width      : 200 + 'px', 
            height     : 20 + 'px',                
            content    : 'div', //'div', 'ajax', 'iframe',
            modalClose : false,
            html       : '<div class="layer2" style="text-align:center;"><strong>데이터</strong> 요청 중입니다.</div>'
            */
            id         : 'loading',
            width      : 90 + 'px', 
            height     : 64 + 'px',                
            content    : 'div', //'div', 'ajax', 'iframe',
            modalClose : false,
            opacity    : .0,
            html       : '<div class="layer1" style="text-align:center;"><img src="/public_html/resource/images/ajax_loader/ajax_loader_blue_64.gif" alt="다음 목록" /></div>'            
        });            
    }

    response.implement = ajax;

});
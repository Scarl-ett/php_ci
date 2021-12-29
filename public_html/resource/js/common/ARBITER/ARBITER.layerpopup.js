/*
    arbi.layerpopup({
        id      : 'pop',
        css     : 'layer1', 
        width   : 1024 + 'px', 
        height  : 620 + 'px',  
        closeClass : 'bClose', // �ݱ� ��ư Ŭ������              
        drag    : false,
        //html    : $('#layer_content').html()
        content :'iframe', // 'iframe' or 'div',
        loadUrl :'/Learningmanagement/Assignment/homework', //Uses jQuery.load()
        onOpen : function() {
            //alert('a');
        }                
    });            
 * 
 */
ARBITER.declare('ARBITER.layerpopup', [], function(response) {
    
    var $ = jQuery;

    layerpopup = function(options, callback) {
        
        // ie 7.0 ���� üũ ( ���̾� �˾��� ������ ȿ�������� ie7���� ������ ����ó�� )
        var ie07 = false;
        if(navigator.appVersion.indexOf('IE 7.0') > 0){
            ie07 = true;
        }
        
        if ($.isFunction(options)) {
            callback        = options;
            options         = null;
        }

        // OPTIONS
        var o               = $.extend({}, layerpopup.defaults, options);
        
        // HIDE SCROLLBAR?  
        if (!o.scrollBar)
            $('html').css('overflow', 'hidden');
        
        // VARIABLES    
        var $popup          = createLayer()
            , d             = $(document)
            , w             = $(window)
            , prefix        = '__layerpopup'
            , popups
            , id
            , original      = '';

        function createLayer() {
            
            var oDiv = $('<div />', {
                id     : o.id,
                width  : o.width,
                height : o.height
            })
            
            // �ݱ� ��ư ����
            // iframe�� �ƴҶ��� 
            // ���� ���� : iframe �ۿ� �ִ� close�� ������ �ݰ� �� �� �巡�װ� �ȵ� (ie10, ie11 ���� �߻�)
            if (o.closeBtn == true) {
                var oBtn = $('<a href="#" title="�ݱ�" class="'+o.closeClass+'"><img src="/public_html/resource/images/common/btn/btn_close.png" alt="CLOSE" /></a>')
                .css({'position' : 'absolute', 'right' : '9px', 'top' : '-32px'}); 

                oDiv.append(oBtn);
            }

            // �巡�� ����
            if (o.drag) {
                oDiv.draggable();
            }
            
            return oDiv.appendTo("body");
        }            
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PUBLIC FUNCTION - call it: element.close();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $popup.close = function() {
            o = this.data('layerpopup');
            id = prefix + w.data('layerpopup')
            close();
        };
        
        return $popup.each(function() {
            if ($popup.data('layerpopup')) return; //POPUP already exists?
            initialize();
        });
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // HELPER FUNCTIONS - PRIVATE
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function initialize() {
            
            // ���� �ɶ� �ݹ�
            triggerCall(o.onOpen);
            popups = (w.data('layerpopup') || 0) + 1, id = prefix + popups;
            
            // ���̾� ����
            open();
        }
        function open(){
            
            // MODAL OVERLAY
            if (o.modal) {
                var mask = $('<div class="bModal '+id+'"></div>')
                .css({'background-color': o.modalColor, 'height': '100%', 'left': 0, 'opacity': o.opacity, 'filter' : 'alpha(opacity='+(o.opacity*100)+')', 'position': 'fixed', 'top': 0, 'width': '100%', 'z-index': o.zIndex + popups});
                
                mask.each(function() {
                    if(o.appending) {
                        $(this).appendTo(o.appendTo);
                    }
                });
                
                if(ie07){
                    mask.fadeTo(o.fadeSpeed);
                }else{
                    mask.show(o.fadeSpeed);
                } 
                               
            }

            var innerPop = $popup.data('layerpopup', o).data('id',id);
            
//            // ��� ����
//            var mrginleft = -($popup.width()/2);
//            var margintop = -($popup.height()/2);
//                
//            /*
//             * �˾� ����� �ش� ������� ���� ������� ���� �� ���� ������.
//             */
//            //var minHeight = screen.height - 100; // �ش� ����Ϳ��� ȭ�鿡 ǥ���� �� �ִ� �ּ� ���� ������
//            var minHeight = $(window).height(); // �ش� ����Ϳ��� ȭ�鿡 ǥ���� �� �ִ� �ּ� ���� ������
//            
//            if (parseInt(o.height.replace('px', '')) > minHeight) {
//                margintop += 150;
//            }                
//            innerPop.css({ 'position': o.positionStyle, 'left': '50%', 'top': '50%', 'margin-left' : mrginleft + "px", 'margin-top' : margintop + "px", 'z-index': o.zIndex + popups + 1 });                
            
            if (o.positionStyle == 'absolute') {
                
                var left = ( w.scrollLeft() + (w.width() - $popup.width()) / 2 );
                
                /*
                 * �˾� ����� �ش� ������� ���� ������� Ŀ�� �������(����) �� ������ ��
                 */            
                var minHeight = $(window).height() - 50;
                
                if (parseInt(o.height.replace('px', '')) > minHeight) {
                    var top = w.scrollTop() + 80;
                } else {
                    var top = ( w.scrollTop() + (w.height() - $popup.height()) / 2 );
                }
                
            } else {
                var left = w.width()/2-$popup.width()/2  + "px";
                var top = w.height()/2-$popup.height()/2 + "px";                                        
            }            
            
            innerPop.css({ 'left': left, 'position': o.positionStyle, 'top': top, 'z-index': o.zIndex + popups + 1 });                
            
            innerPop.each(function() {
                if(o.appending) {
                    $(this).appendTo(o.appendTo);
                }
            });
            
            if(ie07){
                innerPop.fadeIn(o.fadeSpeed, function() {
                    // innerPopup ����
                    if (o.content == 'iframe') {
                        createContent();
                    } else {
                        createContentDiv();
                    }
                    
                    // BINDING EVENTS
                    bindEvents();
                    
                    // Triggering the callback if set
                    triggerCall(callback);                    
                });
            }else{
                innerPop.show(o.fadeSpeed, function() {
                    // innerPopup ����
                    if (o.content == 'iframe') {
                        createContent();
                    } else {
                        createContentDiv();
                    }
                    
                    // BINDING EVENTS
                    bindEvents();
                    
                    // Triggering the callback if set
                    triggerCall(callback);                    
                });
            }            
        }        
        function createContent() {
            o.contentContainer = $(o.contentContainer || $popup);
            switch (o.content) {
                case ('iframe'):
                    var ifr = $('<iframe/>', {
                        id : 'bIframe',
                        src : o.loadUrl,
                        width : o.width,
                        height : o.height,
                        frameborder : 0,
                        scrolling : o.scrollBar ? "yes" : "no"
                    }).appendTo(o.contentContainer);
                    break;
                    
                default:
                    o.contentContainer.load(o.loadUrl);
                    break;
            }
        }
        function createContentDiv() {
            o.contentContainer = $(o.contentContainer || $popup);
            
            // ���̾� ����
            if (o.detach) {
                original = o.detach.children().detach();
                o.contentContainer.append(original);                
            } else {
                o.contentContainer.append(o.html);                
            }
        }
        function close() {
            unbindEvents();
            
            var fadeSpeed = o.fadeSpeed;
            
            // IE9 �̻󿡼� ������������ �����ϸ� �θ�â�� �巡�װ� �ȵǴ� ���󶧹��� �߰�
            // ���� : http://bugs.jqueryui.com/ticket/9122
            if (o.content == 'iframe') {
                $('#bIframe', $popup).attr('src', 'about:blank');
            }            
            
            if (o.modal) {
                
                $('.bModal.'+$popup.data('id'))
                .fadeTo(fadeSpeed, 0, function() {
                    $(this).remove();
                });
                
                //$('.bModal.'+$popup.data('id')).remove();
            }            
            
            if(ie07){
                //$popup.stop().fadeOut(fadeSpeed, function() {
                    if (o.onClose) {
                        setTimeout(function() {
                            triggerCall(o.onClose);
                        }, fadeSpeed);
                    }
                    
                    if (o.detach) {
                        o.detach.append(original);
                    }
                    
                    $popup.remove();                    
                //});
            }else{
                //$popup.stop().hide(fadeSpeed, function() {
                    if (o.onClose) {
                        setTimeout(function() {
                            triggerCall(o.onClose);
                        }, fadeSpeed);
                    }
                    
                    if (o.detach) {
                        o.detach.append(original);
                    }
                    
                    $popup.remove();                                        
                //});                
            }

            return false; // Prevent default
        }
        function bindEvents() {
            w.data('layerpopup', popups);
            
            $popup.delegate('.' + o.closeClass, 'click.'+id, close);
            
            // iframe �ȿ� �ִ� �༮�鵵 �̺�Ʈ�� �ɾ��ش�.
            if (o.content == 'iframe') {
                
                /*
                setTimeout(function() {
                    console.log($('#bIframe', $popup).contents());
                    $('#bIframe', $popup).contents().delegate('.' + o.closeClass, 'click.'+id, close);
                }, 5000);
                */
                
                // iframe �ε��� �Ϸ� �Ǹ�
                $('#bIframe', $popup).load(function(){
                    $(this).contents().delegate('.' + o.closeClass, 'click.'+id, close);
                });

            }
            
            if (o.modalClose) {
                $('.bModal.'+id).css('cursor', 'pointer').bind('click', close);
            }

            if (o.escClose) {
                d.bind('keydown.'+id, function(e) {
                    if (e.which == 27) {  //escape
                        close();
                    }
                });
            }
            
        }
        function unbindEvents() {
            if (!o.scrollBar) {
                $('html').css('overflow', 'auto');
            }
            
            $popup.undelegate('.' + o.closeClass, 'click.'+id, close);                
            
            if (o.content == 'iframe') {
                $('#bIframe', $popup).contents().undelegate('.' + o.closeClass, 'click.'+id, close);
            }
            
            $('.bModal.'+id).unbind('click');
            d.unbind('keydown.'+id);
            w.unbind('.'+id);
            w.data('layerpopup', (w.data('layerpopup')-1 > 0) ? w.data('layerpopup')-1 : null);
            $popup.data('layerpopup', null);
        }
        function triggerCall(func) {
            $.isFunction(func) && func.call($popup);
        }        
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // DEFAULT VALUES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    layerpopup.defaults = {
        appending:        true
        , appendTo:         'body'
        , closeBtn:         false    // �ݱ� ��ư ������ ?
        , closeClass:       'close'  // �ݱ� ��ư���� �� class ��
        , content:          'div'
        , contentContainer: false
        , escClose:         true
        , fadeSpeed:        500
        , opacity:          .8
        , loadUrl:          false
        , modal:            true
        , modalClose:       true
        , modalColor:       '#000'
        , onClose:          false
        , onOpen:           false
        , positionStyle:    'absolute'//type: absolute or fixed
        , scrollBar:        true
        , zIndex:           9997 // popup gets z-index 9999, modal overlay 9998
        , id:               'ul_layer'
        , width:            800 + 'px'
        , height:           600 + 'px'
        , drag:             false
        , html:             ''
        , detach:           false  // tpl�� �ִ� ���̾ ��ﶧ ���� html�� ���� �� ����. (��� �ߺ� ����)
    };
    
    response.implement = layerpopup;

});
ARBITER.init('FOOTER', ['layerpopup'], function(dom, arbi) {

    var publicObj, view;

    /**
     * 외부에서 참조 해야 할 함수가 있는 경우 이곳에 정의 하십시오.
     * ex) arbi.get('MEMBER_LISTS').test();
     */
    publicObj = {
          //test : test;
    };

    function initialize() {
        initView();
        attachEventHandler();
    }

    function initView()
    {
        
    }

    function attachEventHandler()
    {
        // 원격
        $('#oFooterBtnRemote').bind("click", function() {
            window.open('https://988.co.kr', 'remote' ,'scrollbars=no,resizable=yes,width=1000,height=740,top=50');
            return false;
        });

        // 개인정보 취급방침
        $('#oFooterBtnPrivacy').bind("click", function() {
            arbi.layerpopup({
                id         : 'a_1',
                width      : 1024 + 'px', 
                height     : 560 + 'px',
                content    : 'iframe', //'ajax', 'iframe' or 'image',
                closeClass : 'tsClose',
                closeBtn   : false,
                loadUrl    :'/Etc/privacy',
                onOpen     : function() {}
            });

            return false;
        });
    }

    // 초기화 함수 실행
    initialize();

    return publicObj;
});

ARBITER.init('FOOTER', ['layerpopup'], function(dom, arbi) {

    var publicObj, view;

    /**
     * �ܺο��� ���� �ؾ� �� �Լ��� �ִ� ��� �̰��� ���� �Ͻʽÿ�.
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
        // ����
        $('#oFooterBtnRemote').bind("click", function() {
            window.open('https://988.co.kr', 'remote' ,'scrollbars=no,resizable=yes,width=1000,height=740,top=50');
            return false;
        });

        // �������� ��޹�ħ
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

    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});

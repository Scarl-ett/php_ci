ARBITER.init('HEADER', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view;

    /**
     * �ܺο��� ���� �ؾ� �� �Լ��� �ִ� ��� �̰��� ���� �Ͻʽÿ�.
     * ex) arbi.get('MEMBER_LISTS').test();
     */
    publicObj = {
          //test : test;
    };

    function initialize()
    {
        initView();
        attachEventHandler();
    }

    function initView()
    {
        
    }

    function attachEventHandler()
    {
        // ����
        $('#oHeaderBtnMemoOpen').bind('click', function(e){
            arbi.layerpopup({
                id         : 'pop',
                width      : 730 + 'px',
                height     : 713 + 'px',
                scrollBar  : true,
                content    : 'iframe', //'div', 'ajax', 'iframe',
                closeBtn   : false,
                closeClass : 'tsClose',
                loadUrl    : '/Memo/memo',
                onClose    : function() {}
            });

            return false;
        });

        // ���� ž��� -> �����ϱ� ��ư Ŭ�� ��
        $('#oHeaderBtnGoPayment').bind('click', function() {
            window.location.href = '/Payment/paymentstudent';
            return false;
        });

        // �л����� -> �����ϱ� ��ư Ŭ�� ��
        $('#openPaymentStudentBtn').bind('click', function() {
            window.location.href = '/Payment/paymentstudent';
            return false;
        });

        // FC ���� -> �����ϱ� ��ư Ŭ�� ��
        $('#openPaymentBtn').bind('click', function() {
            window.open('/Payment/payment?paykey=' + $('#oHeaderPayKey').val(), 'elsdpayment', 'scrollvars=no, resizable=no, location=no, width=720, height=700, left=350, top=230')
            return false;
        });
    }

    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});

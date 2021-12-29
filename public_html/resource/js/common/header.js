ARBITER.init('HEADER', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view;

    /**
     * 외부에서 참조 해야 할 함수가 있는 경우 이곳에 정의 하십시오.
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
        // 쪽지
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

        // 결제 탑배너 -> 결제하기 버튼 클릭 시
        $('#oHeaderBtnGoPayment').bind('click', function() {
            window.location.href = '/Payment/paymentstudent';
            return false;
        });

        // 학생결제 -> 결제하기 버튼 클릭 시
        $('#openPaymentStudentBtn').bind('click', function() {
            window.location.href = '/Payment/paymentstudent';
            return false;
        });

        // FC 결제 -> 결제하기 버튼 클릭 시
        $('#openPaymentBtn').bind('click', function() {
            window.open('/Payment/payment?paykey=' + $('#oHeaderPayKey').val(), 'elsdpayment', 'scrollvars=no, resizable=no, location=no, width=720, height=700, left=350, top=230')
            return false;
        });
    }

    // 초기화 함수 실행
    initialize();

    return publicObj;
});

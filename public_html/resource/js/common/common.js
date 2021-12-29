ARBITER.init('COMMON', [], function(dom, arbi) {

    var publicObj, view;
    
    var modal = null;

    /**
     * 외부에서 참조 해야 할 함수가 있는 경우 이곳에 정의 하십시오.
     * ex) arbi.get('COMMON').test();
     */
    publicObj = {
        isEmpty : isEmpty,
        isNotEmpty : isNotEmpty
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
        
    }
    
    //null, '', undefined 일때
    function isEmpty(val) {
        if (val == null || val == '' || val == 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    //null, '', undefined가 아닐때
    function isNotEmpty(val) {
        if (val != null && val != '' && val != 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    // 초기화 함수 실행
    initialize();

    return publicObj;
});
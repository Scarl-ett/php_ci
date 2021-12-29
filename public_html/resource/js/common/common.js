ARBITER.init('COMMON', [], function(dom, arbi) {

    var publicObj, view;
    
    var modal = null;

    /**
     * �ܺο��� ���� �ؾ� �� �Լ��� �ִ� ��� �̰��� ���� �Ͻʽÿ�.
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
    
    //null, '', undefined �϶�
    function isEmpty(val) {
        if (val == null || val == '' || val == 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    //null, '', undefined�� �ƴҶ�
    function isNotEmpty(val) {
        if (val != null && val != '' && val != 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});
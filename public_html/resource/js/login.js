ARBITER.init('MAIN', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;

    /**
     * �ܺο��� ���� �ؾ� �� �Լ��� �ִ� ��� �̰��� ���� �Ͻʽÿ�.
     * ex) arbi.get('MEMBER_LISTS').test();
     */
    publicObj = {
        // calRefresh : calRefresh,
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
        //�α��ι�ư Ŭ�� �̺�Ʈ
        $("#loginBtn").on("click", function() {
            var iCount = 0;

            //�ʼ��Է��±� null ���Խ� üũ
            if (!ARBITER.get('REGEX').idRgx($("[name='user_id']"))) iCount++;
            if (!ARBITER.get('REGEX').pwRgx($("[name='user_pw']"))) iCount++;
            
            //null�� �ƴϰ� ���ԽĿ� ������� �� submit
            if (iCount == 0) {
                $("#loginForm").submit();
            }
            
            return false;
        });
        
        //id ���Խ�  
        $("[name='user_id']").on("change", function() {
            ARBITER.get('REGEX').idRgx($(this));
            return false;
        });

        //��й�ȣ ���Խ�
        $("input[name='user_pw']").on("change", function() {
            ARBITER.get('REGEX').pwRgx($(this));
            return false;
        });
        
        //join
        $("#joinBtn").on("click", function(){
            window.location.href = '/user/signup';
            return false;
        });
    }

    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});
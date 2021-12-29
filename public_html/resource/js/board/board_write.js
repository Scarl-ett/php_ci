ARBITER.init('BOARD_WRITE', ['layerpopup', 'ajax'], function(dom, arbi) {

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
        //�����ϱ� ��ư�� ������ ��
        $("#saveBtn").on("click", function(){
            //name �Ӽ��� ������ �ʼ��Է»����� �Է��±�
            var iCount  = 0;

            //�ʼ��Է»��� null ���Խ� üũ
            if (!ARBITER.get('REGEX').titleRgx($("[name='bo_title']"))) iCount++;
            if (!ARBITER.get('REGEX').contentRgx($("[name='bo_content']"))) iCount++;
            
            if ($("input[name='bo_pw']").prop("required") === true) {
                if (!ARBITER.get('REGEX').pwRgx($("input[name='bo_pw']"))) iCount++;
            }

            //�ʼ��Է»����� null�� �ƴҶ� submit
            if (iCount == 0) {
                $("#writeForm").submit();
            }
            return false;
        });

        $("[name='bo_title']").on("change", function() {
            ARBITER.get('REGEX').titleRgx($(this));
            return false;
        });

        $("[name='bo_content']").on("change", function() {
            ARBITER.get('REGEX').contentRgx($(this));
            return false;
        });
        
        //��б� ���� üũ�� ��й�ȣ �׸� �ʼ��׸����� ����
        $("[name='bo_sec']").on("change", function() {
            if ($(this).is(":checked")) {
                $("[name='bo_pw']").parents("tr").children("th").prepend('<span class="red-color">* </span>');
                $("[name='bo_pw']").prop({"required": true, "readonly": false});
            } else {
                $("[name='bo_pw']").parents("tr").children("th").text("��й�ȣ");
                $("[name='bo_pw']").prop({"required": false, "readonly": true}).val("");
                $("[name='bo_pw']").removeClass("is-invalid invalid");
                $("[name='bo_pw']").next().hide();
            }
            return false;
        });

        //��б��϶��� ��й�ȣ ���Խ� üũ
        $("input[name='bo_pw']").on("change", function() {
            if ($(this).prop("required", true)) {
                ARBITER.get('REGEX').pwRgx($(this));
            }
            return false;
        });
        
        //����̵�
        $("#listBtn").on("click", function(){
            window.location.href = "/Board/lists";
            return false;
        });
    }

    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});
ARBITER.init('JOIN', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;
    
    //id
    var oId = $("input[name='user_id']");
    
    //password
    var oUserPw  = $("input[name='user_pw']");
    var oUserPw2 = $("input[name='user_pw2']");

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
        //ȸ������ ��ư�� ������ ��
        $("#joinBtn").on("click", function() { 
            var iCount = 0;

            //�ʼ��Է��±� ���Խ�, null üũ
            if (!ARBITER.get('REGEX').pwRgx($("[name='user_pw']"))) iCount++;
            if (!ARBITER.get('REGEX').pwCheck($("[name='user_pw']"), $("[name='user_pw2']"))) iCount++;
            if (!ARBITER.get('REGEX').nameRgx($("[name='user_name']"))) iCount++;
            if (!ARBITER.get('REGEX').emailIdRgx($("[name='user_email1']"))) iCount++;
            if (!ARBITER.get('REGEX').emailHostRgx($("[name='user_email2']"))) iCount++;
            if (!ARBITER.get('REGEX').telRgx($("[name='user_tel']"))) iCount++;
            if (!ARBITER.get('REGEX').addr2Rgx($("[name='user_addr2']"))) iCount++;
            
            var sZip = $.trim($("[name='user_zip']").val());
            if (ARBITER.get('COMMON').isEmpty(sZip)) {
                $("[name='user_zip']").addClass("is-invalid invalid");
                iCount++;
            }
            
            var sAddr1 = $.trim($("[name='user_addr1']").val());
            if (ARBITER.get('COMMON').isEmpty(sAddr1)) {
                $("[name='user_addr1']").addClass("is-invalid invalid");
                iCount++;
            }
            
            if (!ARBITER.get('REGEX').privacyRgx($("[name='user_privacy']"))) iCount++;
            
            //null�� �ƴҶ��� ���Խ� üũ
            if (!ARBITER.get('REGEX').idRgx($("[name='user_id']"))) { //id���Խ��� ������� ���ߴٸ�
                 iCount++;
            } 
            
            //id���ԽĿ� ����ߴٸ�
            //id�ߺ�üũ - �񵿱� ��û�� �� ������ iCount üũ�ؼ� submit
            idCheck().then(function(resp) {
                if (resp == "FAIL") {
                    iCount++;
                }
                
                //null�� �ƴϰ� ���ԽĿ� ������� ��� submit
                if (iCount == 0) {
                    $("#joinForm").submit();
                }
            }, function (error) {
                console.log(error);
            });

            return false;
        });
        
        //id �ߺ�üũ
        $("#idCheckBtn").on("click", function() {
            idCheck();
            return false;
        });

        //id ���Խ�
        oId.on("change", function() {
            //���̵� ����� �� ���� ���Խ�, �ߺ�üũ ��˻�
            //���Խ� üũ
            if (ARBITER.get('REGEX').idRgx($(this))) { //���ԽĿ� ������� ��
                idCheck(); //id�ߺ��˻�
            }
            return false;
        });
        
        //password ���Խ� Ȯ��
        $(oUserPw).on("change", function() {
            oUserPw2.val("").removeClass("is-valid valid is-invalid, invalid");
            ARBITER.get('REGEX').pwRgx(oUserPw);
            return false;
        });

        //password ��ġ ���� �Ǵ�
        $(oUserPw2).on("change", function() {
            ARBITER.get('REGEX').pwCheck(oUserPw, oUserPw2);
            return false;
        });         

        //name ���Խ�
        $("input[name='user_name']").on("change", function() {
            ARBITER.get('REGEX').nameRgx($(this));
            return false;
        });

        //email ���Խ�
        //email ���̵� ���Խ�
        $("[name='user_email1']").on("change", function() {
            ARBITER.get('REGEX').emailIdRgx($(this));
            return false;
        });

        //email ȣ��Ʈ ����Ʈ �ڽ�
        $("#emailSelect").on("change", function() {
            var sSelectMail = $.trim($(this).val());
            if (sSelectMail == "1") {//�����Է�
                $("[name='user_email2']").val("").removeClass("is-valid valid").attr("readonly", false).focus();
            } else {
                $("[name='user_email2']").val(sSelectMail).attr("readonly", true);
                ARBITER.get('REGEX').emailHostRgx($("[name='user_email2']"));
            }
            return false;
        });

        //email ȣ��Ʈ ���Խ�
        $("[name='user_email2']").on("change", function() {
            ARBITER.get('REGEX').emailHostRgx($(this));
            return false;
        });

        //tel ���Խ�
        $("input[name='user_tel']").on("change", function() {
            ARBITER.get('REGEX').telRgx($(this));
            return false;
        });

        //addr2 ���Խ�
        $("input[name='user_addr2']").on("change", function() {
            ARBITER.get('REGEX').addr2Rgx($(this));
            return false;
        });

        //privacy üũ ���� �Ǵ�
        $("input[name='user_privacy']").on("change", function() {
            ARBITER.get('REGEX').privacyRgx($(this));
            return false;
        });
        
        //�ּҰ˻�
        $("#postcodeBtn").on("click", function(){
            execDaumPostcode();
            return false;
        });
        
        //��ҹ�ư
        $("#cancelBtn").on("click", function(){
            window.location.href = "/";
            return false;
        });
    }
    
    //���̵� �ߺ�üũ
    function idCheck(){
        //promise - �񵿱� ó���� �����ϰ� �� ó���� ���� �� ���� ó�� ����
        return new Promise(function(resolve, reject) {
            var sUserId = $.trim(oId.val())
            
            if (ARBITER.get('COMMON').isEmpty(sUserId)) { //���̵� null
                oId.addClass("is-invalid");
            } 
            
            //���̵� null�ƴҶ�
            if (ARBITER.get('REGEX').idRgx(oId)) {//id���ԽĿ� ����ߴٸ�
                //�񵿱� id�ߺ�üũ(id���ԽĿ� ����ؾ߸� �ߺ�üũ ����)
                arbi.ajax('/user/signup/idCheck',
                {
                    user_id : sUserId
                },
                function(ret) {
                    var ret = $.parseJSON(ret);
                    
                    if (ret.check == 'OK') { //�ߺ�x
                        resolve(ret.check);
                        oId.removeClass("is-invalid invalid");
                        oId.addClass("is-valid valid");
                        oId.next(".invalid-feedback").text("��� ������ ���̵��Դϴ�.").css({
                            "display":"block",
                            "color" : "#28a745"
                        });
                    } else { //�ߺ�
                        resolve(ret.check);
                        oId.removeClass("is-valid valid");
                        oId.addClass("is-invalid invalid");
                        oId.next(".invalid-feedback").text("�̹� ��ϵ� ���̵��Դϴ�.").css({
                            "display":"block",
                            "color" : "#dc3545"
                        });
                        oId.focus();
                    }
                });
            } else {//id���Խ� ������� ���ߴٸ�
                oId.addClass("is-invalid");
            }
        });
    }
    
    //���� ���� api
    function execDaumPostcode() {
        new daum.Postcode({
            oncomplete : function(data) {
               var addr      = '';
               var extraAddr = '';
               if (data.userSelectedType === 'R') {
                   addr = data.roadAddress;
               } else {
                   addr = data.jibunAddress;
               }
               
               if (data.userSelectedType === 'R') {
                   if (data.bname !== '' && /[��|��|��]$/g.test(data.bname)) {
                       extraAddr += data.bname;
                   }
                   if (data.buildingName !== '' && data.apartment === 'Y') {
                       extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                   }
                   if (extraAddr !== '') {
                       extraAddr = ' (' + extraAddr + ')';
                   }
               }
               
               //�����ȣ, �⺻�ּ� �ʵ忡 ���� �Է�
               $("input[name='user_zip']").val(data.zonecode);
               $("input[name='user_addr1']").val(addr);
               //���ּ� focus �̵�
               $("input[name='user_addr2']").focus();
               
               //�����ȣ, �⺻�ּҰ� �ʵ忡 �ԷµǸ� validation ���
               ARBITER.get('REGEX').regOk($("input[name='user_zip']"));
               ARBITER.get('REGEX').regOk($("input[name='user_addr1']"));
            }
        }).open();
    }

    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});
ARBITER.init('REGEX', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;

    /**
     * �ܺο��� ���� �ؾ� �� �Լ��� �ִ� ��� �̰��� ���� �Ͻʽÿ�.
     * ex) arbi.get('MEMBER_LISTS').test();
     */
    publicObj = {
        // calRefresh : calRefresh,
        regOk        : regOk,
        regFail      : regFail,
        idRgx        : idRgx,
        pwRgx        : pwRgx,
        pwCheck      : pwCheck,
        nameRgx      : nameRgx,
        emailIdRgx   : emailIdRgx,
        emailHostRgx : emailHostRgx,
        telRgx       : telRgx,
        addr2Rgx     : addr2Rgx,
        privacyRgx   : privacyRgx,
        titleRgx     : titleRgx,
        contentRgx   : contentRgx
    };

    function initialize() {
        initView();
    }

    function initView()
    {
        
    }
    //���Խ� ������� ��
    function regOk(oTag) {
        $(oTag).removeClass("is-invalid invalid");
        $(oTag).addClass("is-valid valid");
        $(oTag).next(".invalid-feedback").css("display", "none");
        return true;
    }
    
    //���Խ� ������� ������ ��
    function regFail(oTag, sMessage) {
        $(oTag).removeClass("is-valid valid");
        $(oTag).addClass("is-invalid invalid");
        $(oTag).next(".invalid-feedback").text(sMessage).css({
            "display":"block",
            "color" : "#dc3545"
        });
        $(oTag).focus();
        return false;
    }
    
    //id ���Խ�
    function idRgx(oIdTag) {
        var sUserId = $.trim(oIdTag.val());
        //���ҹ��ڷ� �����ϴ� ������, ���� ���� 4~12�ڸ�
        var sRgxId = /^[a-z][a-zA-Z0-9]{3,11}$/;
        
        //id ���Խ� ��� �� id �ߺ�üũ�� ���� false, true ����
        
        if (sRgxId.test(sUserId)) {//���Խ�
            return regOk(oIdTag);
        } else if (ARBITER.get('COMMON').isEmpty(sUserId)) {//null
            return regFail(oIdTag, "���̵� �Է����ּ���.(���ҹ��ڷ� �����ϴ� ������, ���� ���� 4~12�ڸ�)");
        } else {
            return regFail(oIdTag, "���̵� ������ �ùٸ��� �ʽ��ϴ�.(���ҹ��ڷ� �����ϴ� ������, ���� ���� 4~12�ڸ�)");
        }
        
    }
    
    //��й�ȣ ���Խ�
    function pwRgx(oUserPw) {
        var sPw = $.trim(oUserPw.val());
        
        //���� �ҹ���, ���� �빮��, ����, Ư������ ���� 8~12�ڸ�
        var sRegPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
        
        //�����ȣ ���Խ� üũ �� ��й�ȣ ��ġ ���� �Ǵ��� ���� false, true ��ȯ 
        if (ARBITER.get('COMMON').isEmpty(sPw)) {//null
            return regFail(oUserPw, "��й�ȣ�� �Է����ּ���.(���� �ҹ���, ���� �빮��, ����, Ư������(!@$%&* �� ���) 8~12�ڸ�)");
        } else if (!sRegPw.test(sPw)) {//���Խ�
            return regFail(oUserPw, "��й�ȣ ������ �ùٸ��� �ʽ��ϴ�.(���� �ҹ���, ���� �빮��, ����, Ư������(!@$%&* �� ���) 8~12�ڸ�)");
        } else {
            return regOk(oUserPw);
        }
    }
    
    //��й�ȣ ��ġ ���� �Ǵ�
    function pwCheck(oUserPw, oUserPw2) {
        var sPw  = $.trim(oUserPw.val());
        var sPw2 = $.trim(oUserPw2.val());
        
        if (ARBITER.get('COMMON').isEmpty(sPw2)) { //��й�ȣ2 null
            return regFail(oUserPw2, "��й�ȣ�� �Է����ּ���.");
        }
        
        if (sPw != sPw2) {//��й�ȣ�� �������� ������
            $(oUserPw2).val("");
            return regFail(oUserPw2, "��й�ȣ�� ��ġ���� �ʽ��ϴ�.");
        } else {
            if (pwRgx(oUserPw)) { //���Խ��� ����ߴٸ�
                return regOk(oUserPw2); //valid ���ó��
            } else { //���Խ��� ������� �ʾҴٸ�
                return regFail(oUserPw2, ""); //valid ����
            }
        }
    }
    
    //�̸� ���Խ�
    function nameRgx(oUserName) {
        var sName = $.trim(oUserName.val());
        
        //�ѱ� 2~8�ڸ�
        var sRegName = /^[��-��]{2,8}$/;
        
        if (ARBITER.get('COMMON').isEmpty(sName)) {//null
            return regFail(oUserName, "�̸��� �Է����ּ���.");
        } else if (!sRegName.test(sName)) { //���Խ�
            return regFail(oUserName, "�̸��� ������ �ùٸ��� �ʽ��ϴ�.(�ѱ� 2~8�ڸ�)");
        } else {
            return regOk(oUserName);
        }
    }
    
    //�̸��� ���̵� ���Խ�
    function emailIdRgx(oEmailId) {
        var sEmailIdStr = $.trim(oEmailId.val());
        
        //�ѱ� ����
        var sRegEmailId = /^[a-zA-Z0-9._%+-]/;
        
        if (ARBITER.get('COMMON').isEmpty(sEmailIdStr)) {//null
            return regFail(oEmailId, "�̸����� �Է����ּ���.");
        } else if (!sRegEmailId.test(sEmailIdStr)) {//���Խ�
            return regFail(oEmailId, "�̸��� ������ �ùٸ��� �ʽ��ϴ�.");
        } else {
            return regOk(oEmailId);
        }
    }
    
    //�̸��� ȣ��Ʈ ���Խ�
    function emailHostRgx(oEmailHost) {
        var sEmailHostStr = $.trim(oEmailHost.val());
        
        var sRegEmailHost = /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        
        if (ARBITER.get('COMMON').isEmpty(sEmailHostStr)) {//null
            return regFail(oEmailHost, "�̸����� �����Ͻðų� ���� �Է����ּ���.");
        } else if (!sRegEmailHost.test(sEmailHostStr)) {//���Խ�
            return regFail(oEmailHost, "�̸��� ������ �ùٸ��� �ʽ��ϴ�.");
        } else {
            return regOk(oEmailHost);
        }
    }
    
    //��ȭ��ȣ ���Խ�
    function telRgx(oUserTel) {
        var sUserTelStr = $.trim(oUserTel.val());
        
        var sRegTel =  /^\d{3}-\d{3,4}-\d{4}$/;
        
        if (ARBITER.get('COMMON').isEmpty(sUserTelStr)) {//null
            return regFail(oUserTel, "��ȭ��ȣ�� �Է����ּ���. (ex 010-1234-5678)");
        } else if (!sRegTel.test(sUserTelStr)) {//���Խ�
            return regFail(oUserTel, "��ȭ��ȣ ������ �ùٸ��� �ʽ��ϴ�.(ex 010-1234-5678)")
        } else {
            return regOk(oUserTel);
        }
    }
    
    //���ּ� null üũ
    function addr2Rgx(oUserAddr2) {
        var sUserAddrStr = $.trim(oUserAddr2.val());
        
        if (ARBITER.get('COMMON').isEmpty(sUserAddrStr)) {//null
            return regFail(oUserAddr2, "���ּҸ� �Է����ּ���.");
        } else {
            return regOk(oUserAddr2);
        }
    }
    
    //������������ üũ ���� �Ǵ�
    function privacyRgx(oUserPrivacy) {
        if (oUserPrivacy.is(":checked") === false) {
            return regFail(oUserPrivacy, "�����������Ǵ� �ʼ��Դϴ�.");
        } else {
            return regOk(oUserPrivacy);
        }
    }
    
    //�Խñ� ���� null üũ
    function titleRgx(oBoTitle) {
        var sBoTitleStr = $.trim(oBoTitle.val());
        
        if (ARBITER.get('COMMON').isEmpty(sBoTitleStr)) {//null
            return regFail(oBoTitle, "�ʼ��Է� �����Դϴ�.");
        } else {
            return regOk(oBoTitle);
        }
    }
    
    //�Խñ� ���� null üũ
    function contentRgx(oBoContent) {
        var sBoContentStr = $.trim(oBoContent.val());
        
        if (ARBITER.get('COMMON').isEmpty(sBoContentStr)) {//null
            return regFail(oBoContent, "�ʼ��Է� �����Դϴ�.");
        } else {
            return regOk(oBoContent);
        }
    }
    
    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});
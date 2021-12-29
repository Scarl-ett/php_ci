ARBITER.init('JOIN', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;
    
    //id
    var oId = $("input[name='user_id']");
    
    //password
    var oUserPw  = $("input[name='user_pw']");
    var oUserPw2 = $("input[name='user_pw2']");

    /**
     * 외부에서 참조 해야 할 함수가 있는 경우 이곳에 정의 하십시오.
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
        //회원가입 버튼을 눌렀을 때
        $("#joinBtn").on("click", function() { 
            var iCount = 0;

            //필수입력태그 정규식, null 체크
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
            
            //null이 아닐때는 정규식 체크
            if (!ARBITER.get('REGEX').idRgx($("[name='user_id']"))) { //id정규식을 통과하지 못했다면
                 iCount++;
            } 
            
            //id정규식에 통과했다면
            //id중복체크 - 비동기 요청이 다 끝나면 iCount 체크해서 submit
            idCheck().then(function(resp) {
                if (resp == "FAIL") {
                    iCount++;
                }
                
                //null이 아니고 정규식에 통과했을 경우 submit
                if (iCount == 0) {
                    $("#joinForm").submit();
                }
            }, function (error) {
                console.log(error);
            });

            return false;
        });
        
        //id 중복체크
        $("#idCheckBtn").on("click", function() {
            idCheck();
            return false;
        });

        //id 정규식
        oId.on("change", function() {
            //아이디가 변경될 때 마다 정규식, 중복체크 재검사
            //정규식 체크
            if (ARBITER.get('REGEX').idRgx($(this))) { //정규식에 통과했을 때
                idCheck(); //id중복검사
            }
            return false;
        });
        
        //password 정규식 확인
        $(oUserPw).on("change", function() {
            oUserPw2.val("").removeClass("is-valid valid is-invalid, invalid");
            ARBITER.get('REGEX').pwRgx(oUserPw);
            return false;
        });

        //password 일치 여부 판단
        $(oUserPw2).on("change", function() {
            ARBITER.get('REGEX').pwCheck(oUserPw, oUserPw2);
            return false;
        });         

        //name 정규식
        $("input[name='user_name']").on("change", function() {
            ARBITER.get('REGEX').nameRgx($(this));
            return false;
        });

        //email 정규식
        //email 아이디 정규식
        $("[name='user_email1']").on("change", function() {
            ARBITER.get('REGEX').emailIdRgx($(this));
            return false;
        });

        //email 호스트 셀렉트 박스
        $("#emailSelect").on("change", function() {
            var sSelectMail = $.trim($(this).val());
            if (sSelectMail == "1") {//직접입력
                $("[name='user_email2']").val("").removeClass("is-valid valid").attr("readonly", false).focus();
            } else {
                $("[name='user_email2']").val(sSelectMail).attr("readonly", true);
                ARBITER.get('REGEX').emailHostRgx($("[name='user_email2']"));
            }
            return false;
        });

        //email 호스트 정규식
        $("[name='user_email2']").on("change", function() {
            ARBITER.get('REGEX').emailHostRgx($(this));
            return false;
        });

        //tel 정규식
        $("input[name='user_tel']").on("change", function() {
            ARBITER.get('REGEX').telRgx($(this));
            return false;
        });

        //addr2 정규식
        $("input[name='user_addr2']").on("change", function() {
            ARBITER.get('REGEX').addr2Rgx($(this));
            return false;
        });

        //privacy 체크 여부 판단
        $("input[name='user_privacy']").on("change", function() {
            ARBITER.get('REGEX').privacyRgx($(this));
            return false;
        });
        
        //주소검색
        $("#postcodeBtn").on("click", function(){
            execDaumPostcode();
            return false;
        });
        
        //취소버튼
        $("#cancelBtn").on("click", function(){
            window.location.href = "/";
            return false;
        });
    }
    
    //아이디 중복체크
    function idCheck(){
        //promise - 비동기 처리를 실행하고 그 처리가 끝난 후 다음 처리 실행
        return new Promise(function(resolve, reject) {
            var sUserId = $.trim(oId.val())
            
            if (ARBITER.get('COMMON').isEmpty(sUserId)) { //아이디가 null
                oId.addClass("is-invalid");
            } 
            
            //아이디가 null아닐때
            if (ARBITER.get('REGEX').idRgx(oId)) {//id정규식에 통과했다면
                //비동기 id중복체크(id정규식에 통과해야만 중복체크 가능)
                arbi.ajax('/user/signup/idCheck',
                {
                    user_id : sUserId
                },
                function(ret) {
                    var ret = $.parseJSON(ret);
                    
                    if (ret.check == 'OK') { //중복x
                        resolve(ret.check);
                        oId.removeClass("is-invalid invalid");
                        oId.addClass("is-valid valid");
                        oId.next(".invalid-feedback").text("사용 가능한 아이디입니다.").css({
                            "display":"block",
                            "color" : "#28a745"
                        });
                    } else { //중복
                        resolve(ret.check);
                        oId.removeClass("is-valid valid");
                        oId.addClass("is-invalid invalid");
                        oId.next(".invalid-feedback").text("이미 등록된 아이디입니다.").css({
                            "display":"block",
                            "color" : "#dc3545"
                        });
                        oId.focus();
                    }
                });
            } else {//id정규식 통과하지 못했다면
                oId.addClass("is-invalid");
            }
        });
    }
    
    //다음 우편 api
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
                   if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                       extraAddr += data.bname;
                   }
                   if (data.buildingName !== '' && data.apartment === 'Y') {
                       extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                   }
                   if (extraAddr !== '') {
                       extraAddr = ' (' + extraAddr + ')';
                   }
               }
               
               //우편번호, 기본주소 필드에 정보 입력
               $("input[name='user_zip']").val(data.zonecode);
               $("input[name='user_addr1']").val(addr);
               //상세주소 focus 이동
               $("input[name='user_addr2']").focus();
               
               //우편번호, 기본주소가 필드에 입력되면 validation 통과
               ARBITER.get('REGEX').regOk($("input[name='user_zip']"));
               ARBITER.get('REGEX').regOk($("input[name='user_addr1']"));
            }
        }).open();
    }

    // 초기화 함수 실행
    initialize();

    return publicObj;
});
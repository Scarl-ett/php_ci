ARBITER.init('MAIN', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;

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
        //로그인버튼 클릭 이벤트
        $("#loginBtn").on("click", function() {
            var iCount = 0;

            //필수입력태그 null 정규식 체크
            if (!ARBITER.get('REGEX').idRgx($("[name='user_id']"))) iCount++;
            if (!ARBITER.get('REGEX').pwRgx($("[name='user_pw']"))) iCount++;
            
            //null이 아니고 정규식에 통과했을 때 submit
            if (iCount == 0) {
                $("#loginForm").submit();
            }
            
            return false;
        });
        
        //id 정규식  
        $("[name='user_id']").on("change", function() {
            ARBITER.get('REGEX').idRgx($(this));
            return false;
        });

        //비밀번호 정규식
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

    // 초기화 함수 실행
    initialize();

    return publicObj;
});
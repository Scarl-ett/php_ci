ARBITER.init('BOARD_WRITE', ['layerpopup', 'ajax'], function(dom, arbi) {

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
        //저장하기 버튼을 눌렀을 때
        $("#saveBtn").on("click", function(){
            //name 속성을 가지고 필수입력사항인 입력태그
            var iCount  = 0;

            //필수입력사항 null 정규식 체크
            if (!ARBITER.get('REGEX').titleRgx($("[name='bo_title']"))) iCount++;
            if (!ARBITER.get('REGEX').contentRgx($("[name='bo_content']"))) iCount++;
            
            if ($("input[name='bo_pw']").prop("required") === true) {
                if (!ARBITER.get('REGEX').pwRgx($("input[name='bo_pw']"))) iCount++;
            }

            //필수입력사항이 null이 아닐때 submit
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
        
        //비밀글 여부 체크시 비밀번호 항목 필수항목으로 변경
        $("[name='bo_sec']").on("change", function() {
            if ($(this).is(":checked")) {
                $("[name='bo_pw']").parents("tr").children("th").prepend('<span class="red-color">* </span>');
                $("[name='bo_pw']").prop({"required": true, "readonly": false});
            } else {
                $("[name='bo_pw']").parents("tr").children("th").text("비밀번호");
                $("[name='bo_pw']").prop({"required": false, "readonly": true}).val("");
                $("[name='bo_pw']").removeClass("is-invalid invalid");
                $("[name='bo_pw']").next().hide();
            }
            return false;
        });

        //비밀글일때만 비밀번호 정규식 체크
        $("input[name='bo_pw']").on("change", function() {
            if ($(this).prop("required", true)) {
                ARBITER.get('REGEX').pwRgx($(this));
            }
            return false;
        });
        
        //목록이동
        $("#listBtn").on("click", function(){
            window.location.href = "/Board/lists";
            return false;
        });
    }

    // 초기화 함수 실행
    initialize();

    return publicObj;
});
ARBITER.init('BOARD_VIEW', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;
    
    var iBoNo = $.trim($("[name='no']").val());

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
        $("#pwCheck").on("click", function(){
            modalOpen(getFormModalTag());
            $("#myModal").find("form").children("[name='bo_no']").val(iBoNo);
            return false;
        });
        
        $("#deleteBtn").on("click", function(){
            modalOpen(getModalTag());
            return false;
        });

        //모달 비밀번호 입력창 enter키 submit 막기
        $('body').on("keydown", "#myModal input[name='bo_pw']",function(event) {
            if (event.keyCode === 13) { //enter키를 눌렀을때
                return false;
            }
        });

        //모달 닫기버튼 클릭시 모달 form 초기화
        $("body").on("click", ".btn-close", function() {
            modalClose();
            $(".modal").find("[name='bo_pw']").removeClass("is-invalid is-valid invalid valid").val("");
            $(".modal").find("[name='bo_pw']").next().hide();
            return false;
        });
        
        $("body").on("click", "#myModal #pwCheckBtn", function() {
            var oBoPw   = $("#myModal input[name='bo_pw']");
            var iBoNo   = $.trim($("#myModal input[name='bo_no']").val());
            var bPwPass = false;

            if (ARBITER.get('COMMON').isEmpty($.trim(oBoPw.val()))) { //비밀번호 null체크
                $(oBoPw).addClass("is-invalid");
            } else if (ARBITER.get('REGEX').pwRgx(oBoPw)) {
                bPwPass = true;
            } 
            
            //비밀번호가 null이 아니고 정규식을 통과했을 때
            if (bPwPass) {
                arbi.ajax('/Board/board_common/pwCheck',
                {
                    bo_pw : $.trim(oBoPw.val()),
                    bo_no : iBoNo
                },
                function(resp) {
                    var resp = $.parseJSON(resp);
                    
                    if (resp.check == 'OK') { //비밀번호 통과
                        window.location.href = "/Board/read/delete?no=" + iBoNo;
                    } else { //비밀번호 오류
                        alert("비밀번호가 일치하지 않습니다.");
                        oBoPw.removeClass("is-valid valid").addClass("is-invalid invalid").val("");
                        oBoPw.focus();
                    }
                });
            } 
            return false;
        });

        //비밀번호 변경시 정규식 체크
        $("body").on("change", "#myModal input[name='bo_pw']", function() {
            ARBITER.get('REGEX').pwRgx($(this));
            return false;
        });
        
        //목록이동
        $("#listBtn").on("click", function(){
            window.location.href = "/Board/lists";
            return false;
        });
        
        //답글쓰기
        $("#replyBtn").on("click", function(){
            window.location.href = "/Board/reply?no=" + iBoNo;
            return false;
        });
        
        //게시글 수정
        $("#modifyBtn").on("click", function(){
            window.location.href = "/Board/read/updateForm?no=" + iBoNo;
        });
        
        //일반글 삭제
        $("body").on("click", "#myModal2 #realDeleteBtn", function(){
            window.location.href = "/Board/read/delete?no=" + iBoNo;
            return false;
        });
    }
    
    function getFormModalTag() {
        modalTag = '<div class="modal show fade" id="myModal" role="dialog" style="display : block">'
                 + '    <div class="modal-dialog">'
                 + '        <div class="modal-content">'
                 + '            <div class="modal-header">'
                 + '                <h5 class="modal-title" id="exampleModalLabel">게시글 삭제</h5>'
                 + '                <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">'
                 + '                    <i class="fas fa-times"></i>'
                 + '                </button>'
                 + '            </div>'
                 + '            <div class="modal-body">'
                 + '                <p class="p-3 text-center">'
                 + '                    삭제한 게시글은 복원할 수 없습니다.<br/>'
                 + '                    게시글 삭제를 원하시면 게시글 비밀번호를 입력하세요.'
                 + '                </p>'
                 + '                <form method="post" id="pwCheckForm">'
                 + '                    <input type="hidden" name="bo_no" value=""/>'
                 + '                    <div class="mb-3">'
                 + '                        <label for="recipient-name" class="col-form-label">비밀번호</label>'
                 + '                        <input type="password" class="form-control" name="bo_pw" />'
                 + '                        <div class="invalid-feedback">게시글 비밀번호를 입력하세요.</div>'
                 + '                    </div>'
                 + '                </form>'
                 + '            </div>'
                 + '            <div class="modal-footer">'
                 + '                <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="modal" aria-label="Close">취소</button>'
                 + '                <button type="button" class="btn btn-primary" id="pwCheckBtn">확인</button>'
                 + '            </div>'
                 + '        </div>'
                 + '    </div>'
                 + '</div>';
        
        return modalTag;
    }
    
    function getModalTag() {
        modalTag = '<div class="modal show fade" id="myModal2" role="dialog" style="display : block">'
                 + '    <div class="modal-dialog">'
                 + '        <div class="modal-content">'
                 + '            <div class="modal-header">'
                 + '                <h5 class="modal-title" id="exampleModalLabel">게시글 삭제</h5>'
                 + '                <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">'
                 + '                    <i class="fas fa-times"></i>'
                 + '                </button>'
                 + '            </div>'
                 + '            <div class="modal-body">'
                 + '                <p class="p-3 text-center">'
                 + '                    삭제한 게시글은 복원할 수 없습니다.<br/>'
                 + '                    게시글을 삭제하시겟습니까?'
                 + '                </p>'
                 + '            </div>'
                 + '            <div class="modal-footer">'
                 + '                <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="modal" aria-label="Close">취소</button>'
                 + '                <button type="button" class="btn btn-primary" id="realDeleteBtn">확인</button>'
                 + '            </div>'
                 + '        </div>'
                 + '    </div>'
                 + '</div>';
        
        return modalTag;
    }
    
    //modal open 
    function modalOpen(modalTag) {
        modal = arbi.layerpopup({
            id         : 'pwcheck',
            width      : 500 + 'px', 
            height     : 268 + 'px',
            content    : 'div', //'div', 'ajax', 'iframe',
            modalClose : false,
            opacity    : .5,
            zIndex     : 9995,
            html       : modalTag
        });
    }

    //modal close
    function modalClose()
    {
        modal.close();
    }
    

    // 초기화 함수 실행
    initialize();

    return publicObj;
});
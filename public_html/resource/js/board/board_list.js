ARBITER.init('BOARD_LIST', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;

    /**
     * 외부에서 참조 해야 할 함수가 있는 경우 이곳에 정의 하십시오.
     * ex) arbi.get('MEMBER_LISTS').test();
     */
    publicObj = {
            
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
        //logout
        $("#logoutBtn").on("click", function(){
            window.location.href = '/signin/logout';
        });
        
        //검색 - 비동기
        let searchForm = $("#searchForm").on("change", function() {
            //조회 조건이 변경될때마다 page 초기화
            searchForm.find("[name='page']").val("");
            searchForm.submit();
            return false;
        }).ajaxForm({ //전송되는 폼을 가로채서 비동기로 전송
            success : function(resp) {
                var resp = $.parseJSON(resp);
                
                //게시판 검색조건 값
                let iPage       = $.trim($("[name='page']").val());
                let sSearchType = $.trim($("[name='searchType']").val());
                let sSearchWord = $.trim($("[name='searchWord']").val());
                let iScreenSize = $.trim($("[name='screenSize']").val());

                var aSearch = {
                    'curPage'    : iPage,
                    'searchType' : sSearchType,
                    'searchWord' : sSearchWord,
                    'screenSize' : iScreenSize
                };
                //게시판 검색조건 세션 쿠키 생성 - 브라우저를 닫으면 삭제
                $.cookie("search", JSON.stringify(aSearch), {path : "/"});
                
                $("#listBody").empty();
                let aTrTags = [];
                
                if (resp.aList.length > 0) {//게시글 리스트 길이가 0보다 클때
                    //a태그 href 패턴
                    let sViewURLPtrn = "/Board/read?no=%d";

                    //게시글 html 태그 생성
                    $(resp.aList).each(function(i, board) {
                        //답글 css
                        let iDepth = parseInt(board.bo_depth);
                        let sReply = "";
                        if (iDepth > 1) {
                            for (var i = 0; i < iDepth; i++) {
                                sReply += '&nbsp;&nbsp;&nbsp;&nbsp;';
                            }
                            sReply += '<i class="fas fa-level-up-alt"></i>&nbsp;&nbsp;';
                        }
                        
                        let sViewURL = sViewURLPtrn.replace("%d", board.bo_no);
                        let sATag    = "";

                        //글 상세조회 제목 a태그 생성
                        if (board.bo_del == 'Y') {//삭제된 글
                            sATag = $("<sapn>").html("[삭제된 글 입니다.]").css("color", "#c30");
                            sATag.prepend(sReply);
                        } else if (board.bo_sec == 'Y') { //비밀글일때
                            sATag = $("<a>").html(
                                    '<i class="fas fa-lock"></i> &nbsp;비밀글입니다.'
                                ).attr({
                                    "class"       : "text-dark text-decoration-none d-block w-100 pwCheck",
                                    "data-toggle" : "modal",
                                    "href"        : "#myModal",
                                    "data-no"     : board.bo_no
                                });
                            sATag.prepend(sReply);
                        } else { //비밀글, 삭제된 글이 아닐때
                            sATag = $("<a>").attr({
                                        "class"     : "text-dark text-decoration-none d-block w-100",
                                        "href"      : sViewURL
                                    }).html(board.bo_title);
                            sATag.prepend(sReply);
                        }

                        //게시글 tr 태그 생성
                        let sTr = $("<tr>").append(
                                      $("<td>").attr("class", "text-center").html(board.bo_num),
                                      $("<td>").html(sATag),
                                      $("<td>").attr("class", "text-center").html(board.user_name + " (" + board.bo_writer + ")"),
                                      $("<td>").attr("class", "text-center").html(board.bo_date)
                                  );
                        aTrTags.push(sTr);
                    }); //게시글 리스트 row 데이터 처리 end
                } else {
                    let sTr = $("<tr>").html('<td colspan="4" class="text-center">조회할 게시글이 없습니다.</td>'); 
                    aTrTags.push(sTr);
                } //resp.list 데이터 처리 end
                
                $("#listBody").html(aTrTags);

                //페이이네이션 html 태그 출력
                if (resp.sPaging) {
                    $("#pagingArea").html(resp.sPaging);
                }
                
            },
            error : function(xhr, resp, error) {
                console.log(xhr);
                console.log(resp);
                console.log(error);
            } 
        });

        //비동기 -> 동기 처리
        //처음페이지가 로드됐을때 비동기 함수를 실행시킨다.
        //쿠키에 저장되어 있는 게시판 데이터 value세팅
        var aSearch = [];
        if ($.cookie('search')) { //search 쿠키가 있다면
            //쿠키에 저장된 검색조건을 value값으로 지정
            aSearch = JSON.parse($.cookie('search'));
            searchForm.find("[name='page']").val(aSearch.curPage);
            searchForm.find("[name='searchType']").val(aSearch.searchType);
            searchForm.find("[name='searchWord']").val(aSearch.searchWord);
            searchForm.find("[name='screenSize']").val(aSearch.screenSize);
        }
        searchForm.submit();

        //페이지 버튼을 눌렀을 때
        $("#pagingArea").on("click", "a", function(event) {
            event.preventDefault();
            let iPage = $(this).data("page");
            if (iPage) {
                searchForm.find("[name='page']").val(iPage);
                searchForm.submit();
            }
            return false;
        });
        
        //비밀글 클릭시
        $(".table").on("click", ".pwCheck", function() {
            var iBoNo = $(this).data("no");
            modalOpen();
            $("#myModal").find("form").children("[name='bo_no']").val(iBoNo);
            return false;
        });

        //모달 닫기버튼 클릭시 모달 form 초기화
        $("body").on("click", ".btn-close", function() {
            modalClose();
            $("body #myModal").find("[name='bo_pw']").removeClass("is-invalid is-valid invalid valid").val("");
            $("body #myModal").find("[name='bo_pw']").next().hide();
            return false;
        });

        //모달 비밀번호 입력창 enter키 submit 막기
        $('body').on("keydown", "#myModal input[name='bo_pw']",function(event) {
            if (event.keyCode === 13) { //enter키를 눌렀을때
                return false;
            }
        });
        
        $("body").on("click", "#myModal #pwCheckBtn", function() {
            //비밀글 비밀번호 확인 변수
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
                        window.location.href = "/Board/read?no=" + iBoNo; 
                    } else {
                        //비밀번호 오류
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
        
        //글쓰기 버튼 눌렀을 때
        $("#writeBtn").on("click", function(){
            window.location.href = "/Board/write";
        });
    }
    
    //modal open 
    function modalOpen() {
        modal = arbi.layerpopup({
            id         : 'pwcheck',
            width      : 500 + 'px', 
            height     : 268 + 'px',
            content    : 'div', //'div', 'ajax', 'iframe',
            modalClose : false,
            opacity    : .5,
            zIndex     : 9995,
            html       : '<div class="modal show fade" id="myModal" role="dialog" style="display : block">'
                        + '   <div class="modal-dialog">'
                        + '       <div class="modal-content">'
                        + '           <div class="modal-header">'
                        + '               <h5 class="modal-title" id="exampleModalLabel">비밀글</h5>'
                        + '               <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">'
                        + '                   <i class="fas fa-times"></i>'
                        + '               </button>'
                        + '           </div>'
                        + '           <div class="modal-body">'
                        + '               <form method="post" id="pwCheckForm" class="needs-validation" novalidate>'
                        + '                   <input type="hidden" name="bo_no" />'
                        + '                   <div class="mb-3">'
                        + '                       <label for="recipient-name" class="col-form-label">비밀번호</label>'
                        + '                       <input type="password" class="form-control" name="bo_pw" />'
                        + '                       <div class="invalid-feedback">게시글 비밀번호를 입력하세요.</div>'
                        + '                   </div>'
                        + '               </form>'
                        + '           </div>'
                        + '           <div class="modal-footer">'
                        + '               <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="modal" aria-label="Close">취소</button>'
                        + '               <button type="button" class="btn btn-primary" id="pwCheckBtn">확인</button>'
                        + '           </div>'
                        + '       </div>'
                        + '   </div>'
                        + '</div>'
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
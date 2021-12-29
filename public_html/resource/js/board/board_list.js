ARBITER.init('BOARD_LIST', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;

    /**
     * �ܺο��� ���� �ؾ� �� �Լ��� �ִ� ��� �̰��� ���� �Ͻʽÿ�.
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
        
        //�˻� - �񵿱�
        let searchForm = $("#searchForm").on("change", function() {
            //��ȸ ������ ����ɶ����� page �ʱ�ȭ
            searchForm.find("[name='page']").val("");
            searchForm.submit();
            return false;
        }).ajaxForm({ //���۵Ǵ� ���� ����ä�� �񵿱�� ����
            success : function(resp) {
                var resp = $.parseJSON(resp);
                
                //�Խ��� �˻����� ��
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
                //�Խ��� �˻����� ���� ��Ű ���� - �������� ������ ����
                $.cookie("search", JSON.stringify(aSearch), {path : "/"});
                
                $("#listBody").empty();
                let aTrTags = [];
                
                if (resp.aList.length > 0) {//�Խñ� ����Ʈ ���̰� 0���� Ŭ��
                    //a�±� href ����
                    let sViewURLPtrn = "/Board/read?no=%d";

                    //�Խñ� html �±� ����
                    $(resp.aList).each(function(i, board) {
                        //��� css
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

                        //�� ����ȸ ���� a�±� ����
                        if (board.bo_del == 'Y') {//������ ��
                            sATag = $("<sapn>").html("[������ �� �Դϴ�.]").css("color", "#c30");
                            sATag.prepend(sReply);
                        } else if (board.bo_sec == 'Y') { //��б��϶�
                            sATag = $("<a>").html(
                                    '<i class="fas fa-lock"></i> &nbsp;��б��Դϴ�.'
                                ).attr({
                                    "class"       : "text-dark text-decoration-none d-block w-100 pwCheck",
                                    "data-toggle" : "modal",
                                    "href"        : "#myModal",
                                    "data-no"     : board.bo_no
                                });
                            sATag.prepend(sReply);
                        } else { //��б�, ������ ���� �ƴҶ�
                            sATag = $("<a>").attr({
                                        "class"     : "text-dark text-decoration-none d-block w-100",
                                        "href"      : sViewURL
                                    }).html(board.bo_title);
                            sATag.prepend(sReply);
                        }

                        //�Խñ� tr �±� ����
                        let sTr = $("<tr>").append(
                                      $("<td>").attr("class", "text-center").html(board.bo_num),
                                      $("<td>").html(sATag),
                                      $("<td>").attr("class", "text-center").html(board.user_name + " (" + board.bo_writer + ")"),
                                      $("<td>").attr("class", "text-center").html(board.bo_date)
                                  );
                        aTrTags.push(sTr);
                    }); //�Խñ� ����Ʈ row ������ ó�� end
                } else {
                    let sTr = $("<tr>").html('<td colspan="4" class="text-center">��ȸ�� �Խñ��� �����ϴ�.</td>'); 
                    aTrTags.push(sTr);
                } //resp.list ������ ó�� end
                
                $("#listBody").html(aTrTags);

                //�����̳��̼� html �±� ���
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

        //�񵿱� -> ���� ó��
        //ó���������� �ε������ �񵿱� �Լ��� �����Ų��.
        //��Ű�� ����Ǿ� �ִ� �Խ��� ������ value����
        var aSearch = [];
        if ($.cookie('search')) { //search ��Ű�� �ִٸ�
            //��Ű�� ����� �˻������� value������ ����
            aSearch = JSON.parse($.cookie('search'));
            searchForm.find("[name='page']").val(aSearch.curPage);
            searchForm.find("[name='searchType']").val(aSearch.searchType);
            searchForm.find("[name='searchWord']").val(aSearch.searchWord);
            searchForm.find("[name='screenSize']").val(aSearch.screenSize);
        }
        searchForm.submit();

        //������ ��ư�� ������ ��
        $("#pagingArea").on("click", "a", function(event) {
            event.preventDefault();
            let iPage = $(this).data("page");
            if (iPage) {
                searchForm.find("[name='page']").val(iPage);
                searchForm.submit();
            }
            return false;
        });
        
        //��б� Ŭ����
        $(".table").on("click", ".pwCheck", function() {
            var iBoNo = $(this).data("no");
            modalOpen();
            $("#myModal").find("form").children("[name='bo_no']").val(iBoNo);
            return false;
        });

        //��� �ݱ��ư Ŭ���� ��� form �ʱ�ȭ
        $("body").on("click", ".btn-close", function() {
            modalClose();
            $("body #myModal").find("[name='bo_pw']").removeClass("is-invalid is-valid invalid valid").val("");
            $("body #myModal").find("[name='bo_pw']").next().hide();
            return false;
        });

        //��� ��й�ȣ �Է�â enterŰ submit ����
        $('body').on("keydown", "#myModal input[name='bo_pw']",function(event) {
            if (event.keyCode === 13) { //enterŰ�� ��������
                return false;
            }
        });
        
        $("body").on("click", "#myModal #pwCheckBtn", function() {
            //��б� ��й�ȣ Ȯ�� ����
            var oBoPw   = $("#myModal input[name='bo_pw']");
            var iBoNo   = $.trim($("#myModal input[name='bo_no']").val());
            var bPwPass = false;
            
            if (ARBITER.get('COMMON').isEmpty($.trim(oBoPw.val()))) { //��й�ȣ nullüũ
                $(oBoPw).addClass("is-invalid");
            } else if (ARBITER.get('REGEX').pwRgx(oBoPw)) {
                bPwPass = true;
            }

            //��й�ȣ�� null�� �ƴϰ� ���Խ��� ������� ��
            if (bPwPass) {
                arbi.ajax('/Board/board_common/pwCheck',
                {
                    bo_pw : $.trim(oBoPw.val()),
                    bo_no : iBoNo
                },
                function(resp) {
                    var resp = $.parseJSON(resp);
                    
                    if (resp.check == 'OK') { //��й�ȣ ���
                        window.location.href = "/Board/read?no=" + iBoNo; 
                    } else {
                        //��й�ȣ ����
                        alert("��й�ȣ�� ��ġ���� �ʽ��ϴ�.");
                        oBoPw.removeClass("is-valid valid").addClass("is-invalid invalid").val("");
                        oBoPw.focus();
                    }
                    
                });
            } 
            return false;
        });

        //��й�ȣ ����� ���Խ� üũ
        $("body").on("change", "#myModal input[name='bo_pw']", function() {
            ARBITER.get('REGEX').pwRgx($(this));
            return false;
        });
        
        //�۾��� ��ư ������ ��
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
                        + '               <h5 class="modal-title" id="exampleModalLabel">��б�</h5>'
                        + '               <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">'
                        + '                   <i class="fas fa-times"></i>'
                        + '               </button>'
                        + '           </div>'
                        + '           <div class="modal-body">'
                        + '               <form method="post" id="pwCheckForm" class="needs-validation" novalidate>'
                        + '                   <input type="hidden" name="bo_no" />'
                        + '                   <div class="mb-3">'
                        + '                       <label for="recipient-name" class="col-form-label">��й�ȣ</label>'
                        + '                       <input type="password" class="form-control" name="bo_pw" />'
                        + '                       <div class="invalid-feedback">�Խñ� ��й�ȣ�� �Է��ϼ���.</div>'
                        + '                   </div>'
                        + '               </form>'
                        + '           </div>'
                        + '           <div class="modal-footer">'
                        + '               <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="modal" aria-label="Close">���</button>'
                        + '               <button type="button" class="btn btn-primary" id="pwCheckBtn">Ȯ��</button>'
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
    
    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});
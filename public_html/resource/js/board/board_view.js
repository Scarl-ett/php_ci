ARBITER.init('BOARD_VIEW', ['layerpopup', 'ajax'], function(dom, arbi) {

    var publicObj, view, modal = true;
    
    var iBoNo = $.trim($("[name='no']").val());

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
        $("#pwCheck").on("click", function(){
            modalOpen(getFormModalTag());
            $("#myModal").find("form").children("[name='bo_no']").val(iBoNo);
            return false;
        });
        
        $("#deleteBtn").on("click", function(){
            modalOpen(getModalTag());
            return false;
        });

        //��� ��й�ȣ �Է�â enterŰ submit ����
        $('body').on("keydown", "#myModal input[name='bo_pw']",function(event) {
            if (event.keyCode === 13) { //enterŰ�� ��������
                return false;
            }
        });

        //��� �ݱ��ư Ŭ���� ��� form �ʱ�ȭ
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
                        window.location.href = "/Board/read/delete?no=" + iBoNo;
                    } else { //��й�ȣ ����
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
        
        //����̵�
        $("#listBtn").on("click", function(){
            window.location.href = "/Board/lists";
            return false;
        });
        
        //��۾���
        $("#replyBtn").on("click", function(){
            window.location.href = "/Board/reply?no=" + iBoNo;
            return false;
        });
        
        //�Խñ� ����
        $("#modifyBtn").on("click", function(){
            window.location.href = "/Board/read/updateForm?no=" + iBoNo;
        });
        
        //�Ϲݱ� ����
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
                 + '                <h5 class="modal-title" id="exampleModalLabel">�Խñ� ����</h5>'
                 + '                <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">'
                 + '                    <i class="fas fa-times"></i>'
                 + '                </button>'
                 + '            </div>'
                 + '            <div class="modal-body">'
                 + '                <p class="p-3 text-center">'
                 + '                    ������ �Խñ��� ������ �� �����ϴ�.<br/>'
                 + '                    �Խñ� ������ ���Ͻø� �Խñ� ��й�ȣ�� �Է��ϼ���.'
                 + '                </p>'
                 + '                <form method="post" id="pwCheckForm">'
                 + '                    <input type="hidden" name="bo_no" value=""/>'
                 + '                    <div class="mb-3">'
                 + '                        <label for="recipient-name" class="col-form-label">��й�ȣ</label>'
                 + '                        <input type="password" class="form-control" name="bo_pw" />'
                 + '                        <div class="invalid-feedback">�Խñ� ��й�ȣ�� �Է��ϼ���.</div>'
                 + '                    </div>'
                 + '                </form>'
                 + '            </div>'
                 + '            <div class="modal-footer">'
                 + '                <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="modal" aria-label="Close">���</button>'
                 + '                <button type="button" class="btn btn-primary" id="pwCheckBtn">Ȯ��</button>'
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
                 + '                <h5 class="modal-title" id="exampleModalLabel">�Խñ� ����</h5>'
                 + '                <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">'
                 + '                    <i class="fas fa-times"></i>'
                 + '                </button>'
                 + '            </div>'
                 + '            <div class="modal-body">'
                 + '                <p class="p-3 text-center">'
                 + '                    ������ �Խñ��� ������ �� �����ϴ�.<br/>'
                 + '                    �Խñ��� �����Ͻðٽ��ϱ�?'
                 + '                </p>'
                 + '            </div>'
                 + '            <div class="modal-footer">'
                 + '                <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="modal" aria-label="Close">���</button>'
                 + '                <button type="button" class="btn btn-primary" id="realDeleteBtn">Ȯ��</button>'
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
    

    // �ʱ�ȭ �Լ� ����
    initialize();

    return publicObj;
});
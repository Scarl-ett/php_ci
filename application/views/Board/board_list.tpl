<body class="bg-light">
<div class="container mb-5">
    <div class="py-4 d-flex justify-content-center">
        <h4 class="mr-5">ȯ���մϴ�. {? _SESSION.session_name}{_SESSION.session_name}{/}��</h4>
        <button class="btn btn-primary btn-sm" type="button" id="logoutBtn">�α׾ƿ�</button>
    </div>
    <div class="bg-white p-4">
        <form id="searchForm" action="/Board/lists/boardListAjax">
            <input type="hidden" name="page" value=""/>
            <div class="row mb-4 d-flex justify-content-end">
                <div class="col-md-2">
                    <select class="form-control" name="screenSize">
                        <option value="10">10���� ����</option>
                        <option value="20">20���� ����</option>
                        <option value="30">30���� ����</option>
                        <option value="40">40���� ����</option>
                        <option value="50">50���� ����</option>
                    </select>
                </div>
            </div>
            <div class="minH570">
                <table class="table table-hover border-bottom mb-5">
                    <colgroup>
                        <col width="15%"/>
                        <col width="45%"/>
                        <col width="20%"/>
                        <col width="20%"/>
                    </colgroup>
                    <thead>
                        <tr>
                          <th scope="col" class="text-center">#</th>
                          <th scope="col" class="text-center">����</th>
                          <th scope="col" class="text-center">�ۼ���</th>
                          <th scope="col" class="text-center">�ۼ���</th>
                        </tr>
                    </thead>
                    <tbody id="listBody">
                    
                    </tbody>
                </table>
            </div>
            <div class="row mb-5">
                <div class="col-md-2">
                    <select class="form-control" name="searchType">
                        <option value="">��ü</option>
                        <option value="bo_title">����</option>
                        <option value="bo_content">����</option>
                        <option value="bo_writer">�ۼ���</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="text" name="searchWord" class="form-control" value=""/>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <div class="dummy"></div>
                <div id="pagingArea">
                
                </div>
                <div>
                    <button class="btn btn-primary" type="button" id="writeBtn">�۾���</button>
                </div>
            </div>
        </form>
    </div>
</div>

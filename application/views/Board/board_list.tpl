<body class="bg-light">
<div class="container mb-5">
    <div class="py-4 d-flex justify-content-center">
        <h4 class="mr-5">환영합니다. {? _SESSION.session_name}{_SESSION.session_name}{/}님</h4>
        <button class="btn btn-primary btn-sm" type="button" id="logoutBtn">로그아웃</button>
    </div>
    <div class="bg-white p-4">
        <form id="searchForm" action="/Board/lists/boardListAjax">
            <input type="hidden" name="page" value=""/>
            <div class="row mb-4 d-flex justify-content-end">
                <div class="col-md-2">
                    <select class="form-control" name="screenSize">
                        <option value="10">10개씩 보기</option>
                        <option value="20">20개씩 보기</option>
                        <option value="30">30개씩 보기</option>
                        <option value="40">40개씩 보기</option>
                        <option value="50">50개씩 보기</option>
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
                          <th scope="col" class="text-center">제목</th>
                          <th scope="col" class="text-center">작성자</th>
                          <th scope="col" class="text-center">작성일</th>
                        </tr>
                    </thead>
                    <tbody id="listBody">
                    
                    </tbody>
                </table>
            </div>
            <div class="row mb-5">
                <div class="col-md-2">
                    <select class="form-control" name="searchType">
                        <option value="">전체</option>
                        <option value="bo_title">제목</option>
                        <option value="bo_content">내용</option>
                        <option value="bo_writer">작성자</option>
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
                    <button class="btn btn-primary" type="button" id="writeBtn">글쓰기</button>
                </div>
            </div>
        </form>
    </div>
</div>

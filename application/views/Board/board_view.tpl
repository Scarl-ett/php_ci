<body class="bg-light">
<div class="container mb-5">
    <div class="py-5 text-center">
        <h2>게시글 조회</h2>
    </div>
        
    <input type="hidden" name="no" value="{iBoNo}" />
    <table class="table bg-white border">
        <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
        </colgroup>
        <tbody>
            <tr>
                <th class="th-bg text-center align-middle">작성자</th>
                <td>{sUserName} ({sBoWriter})</td>
                <th class="th-bg text-center align-middle">작성일</th>
                <td>{sBoDate}</td>
            </tr>
            <tr>
                <th class="th-bg text-center align-middle">제목</th>
                <td colspan="3" class="border-bottom">{sBoTitle}</td>
            </tr>
        </tbody>
    </table>
    <div class="minH570 bg-white border p-3" style="margin-top: -17px">
        {sBoContent}
    </div>
    <div class="d-flex justify-content-center mt-4 btnWrap">
        <button type="button" class="btn btn-secondary mr-2" id="listBtn">목록으로</button>
        <button type="button" class="btn btn-success mr-2"  id="replyBtn">답글쓰기</button>
        <!-- 로그인한 사람과 작성자가 같으면 수정, 삭제 버튼 노출 -->
        {? sBoWriter == _SESSION.session_id}
        <button type="button" class="btn btn-primary mr-2" id="modifyBtn">수정</button>
            {? sBoSec == 'Y'}
            <button type="button" class="btn btn-danger" data-toggle="modal" id="pwCheck">삭제</button>
            {:}
            <button type="button" class="btn btn-danger" data-toggle="modal" id="deleteBtn">삭제</button>
            {/}
        {/}
    </div>
</div>
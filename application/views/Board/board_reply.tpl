<body class="bg-light">
<div class="container mb-5">
    <div class="py-5 text-center">
        <h2>답글작성</h2>
    </div>
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
    <div class="minH380 bg-white border p-3" style="margin-top: -17px">
        {sBoContent}
    </div>
    <br/>
    <form class="needs-validation" novalidate action="/Board/reply/replyInsert" method="post" id="replyForm">
        <input type="hidden" value="{iParentBoNo}" name="no" />
        <table class="table bg-white border">
            <colgroup>
                <col width="20%" />
                <col width="80%" />
            </colgroup>
            <tbody>
                <tr>
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>제목</th>
                    <td colspan="3" class="border-bottom">
                        <input type="text" name="bo_title" class="form-control" required placeholder="게시글 제목을 입력해주세요.">
                        <div class="invalid-feedback">필수입력 사항입니다.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">비밀글</th>
                    <td colspan="3" class="border-bottom">
                        <input class="form-conrol" type="checkbox" value="Y" name="bo_sec" {? sBoSec == 'Y'}checked onClick='return false;'{/}/>
                        <label class="form-check-label">비밀글 </label>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">비밀번호</th>
                    <td colspan="3" class="border-bottom">
                        <input type="text" name="bo_pw" class="form-control" {? sBoSec == 'Y'}required{:}readonly{/}
                            placeholder="비밀글은 비밀번호를 입력해주세요. (비밀글의 답글은 비밀글입니다.)" >
                        <div class="invalid-feedback">비밀글의 경우 게시글 비밀번호를 입력해야 합니다.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>내용</th>
                    <td colspan="3" class="border-bottom">
                        <textarea name="bo_content" class="form-control minH480" required placeholder="게시글 내용을 입력해주세요."></textarea>
                        <div class="invalid-feedback">필수입력 사항입니다.</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-secondary mr-2" id="listBtn" type="button">목록으로</button>
            <button class="btn btn-primary" id="saveBtn" type="button">저장하기</button>
        </div>
    </form>
</div>
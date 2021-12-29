<body class="bg-light">
<div class="container mb-5">
    <div class="py-5 text-center">
        <h2>게시글 수정</h2>
    </div>
    
    <form class="needs-validation" novalidate action="/Board/read/update" method="post" id="writeForm">
        <input type="hidden" value="{iBoNo}" name="no" />
        <table class="table bg-white border">
            <colgroup>
                <col width="20%" />
                <col width="80%" />
            </colgroup>
            <tbody>
                <tr>
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>제목</th>
                    <td colspan="3" class="border-bottom">
                        <input type="text" name="bo_title" class="form-control" required placeholder="게시글 제목을 입력해주세요." value="{sBoTitle}">
                        <div class="invalid-feedback">필수입력 사항입니다.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">비밀글</th>
                    <td colspan="3" class="border-bottom">
                        <input class="form-conrol" type="checkbox" value="Y" name="bo_sec" {? sBoSec == 'Y'}checked{/}/>
                        <label class="form-check-label">비밀글 </label>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">비밀번호</th>
                    <td colspan="3" class="border-bottom">
                        <input type="password" name="bo_pw" class="form-control" placeholder="비밀글의 경우 게시글 비밀번호를 입력해주세요." {? sBoSec == 'Y'}required{:}readonly{/}/>
                        <div class="invalid-feedback">비밀글의 경우 게시글 비밀번호를 입력해야 합니다.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>내용</th>
                    <td colspan="3" class="border-bottom">
                        <textarea name="bo_content" class="form-control minH480" required placeholder="게시글 내용을 입력해주세요.">{sBoContent}</textarea>
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
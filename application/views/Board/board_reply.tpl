<body class="bg-light">
<div class="container mb-5">
    <div class="py-5 text-center">
        <h2>����ۼ�</h2>
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
                <th class="th-bg text-center align-middle">�ۼ���</th>
                <td>{sUserName} ({sBoWriter})</td>
                <th class="th-bg text-center align-middle">�ۼ���</th>
                <td>{sBoDate}</td>
            </tr>
            <tr>
                <th class="th-bg text-center align-middle">����</th>
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
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>����</th>
                    <td colspan="3" class="border-bottom">
                        <input type="text" name="bo_title" class="form-control" required placeholder="�Խñ� ������ �Է����ּ���.">
                        <div class="invalid-feedback">�ʼ��Է� �����Դϴ�.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">��б�</th>
                    <td colspan="3" class="border-bottom">
                        <input class="form-conrol" type="checkbox" value="Y" name="bo_sec" {? sBoSec == 'Y'}checked onClick='return false;'{/}/>
                        <label class="form-check-label">��б� </label>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">��й�ȣ</th>
                    <td colspan="3" class="border-bottom">
                        <input type="text" name="bo_pw" class="form-control" {? sBoSec == 'Y'}required{:}readonly{/}
                            placeholder="��б��� ��й�ȣ�� �Է����ּ���. (��б��� ����� ��б��Դϴ�.)" >
                        <div class="invalid-feedback">��б��� ��� �Խñ� ��й�ȣ�� �Է��ؾ� �մϴ�.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>����</th>
                    <td colspan="3" class="border-bottom">
                        <textarea name="bo_content" class="form-control minH480" required placeholder="�Խñ� ������ �Է����ּ���."></textarea>
                        <div class="invalid-feedback">�ʼ��Է� �����Դϴ�.</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-secondary mr-2" id="listBtn" type="button">�������</button>
            <button class="btn btn-primary" id="saveBtn" type="button">�����ϱ�</button>
        </div>
    </form>
</div>
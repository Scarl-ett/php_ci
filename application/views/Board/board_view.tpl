<body class="bg-light">
<div class="container mb-5">
    <div class="py-5 text-center">
        <h2>�Խñ� ��ȸ</h2>
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
    <div class="minH570 bg-white border p-3" style="margin-top: -17px">
        {sBoContent}
    </div>
    <div class="d-flex justify-content-center mt-4 btnWrap">
        <button type="button" class="btn btn-secondary mr-2" id="listBtn">�������</button>
        <button type="button" class="btn btn-success mr-2"  id="replyBtn">��۾���</button>
        <!-- �α����� ����� �ۼ��ڰ� ������ ����, ���� ��ư ���� -->
        {? sBoWriter == _SESSION.session_id}
        <button type="button" class="btn btn-primary mr-2" id="modifyBtn">����</button>
            {? sBoSec == 'Y'}
            <button type="button" class="btn btn-danger" data-toggle="modal" id="pwCheck">����</button>
            {:}
            <button type="button" class="btn btn-danger" data-toggle="modal" id="deleteBtn">����</button>
            {/}
        {/}
    </div>
</div>
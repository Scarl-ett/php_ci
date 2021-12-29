<body class="bg-light">
<div class="container mb-5">
    <div class="py-5 text-center">
        <h2>�Խñ� ����</h2>
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
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>����</th>
                    <td colspan="3" class="border-bottom">
                        <input type="text" name="bo_title" class="form-control" required placeholder="�Խñ� ������ �Է����ּ���." value="{sBoTitle}">
                        <div class="invalid-feedback">�ʼ��Է� �����Դϴ�.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">��б�</th>
                    <td colspan="3" class="border-bottom">
                        <input class="form-conrol" type="checkbox" value="Y" name="bo_sec" {? sBoSec == 'Y'}checked{/}/>
                        <label class="form-check-label">��б� </label>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle">��й�ȣ</th>
                    <td colspan="3" class="border-bottom">
                        <input type="password" name="bo_pw" class="form-control" placeholder="��б��� ��� �Խñ� ��й�ȣ�� �Է����ּ���." {? sBoSec == 'Y'}required{:}readonly{/}/>
                        <div class="invalid-feedback">��б��� ��� �Խñ� ��й�ȣ�� �Է��ؾ� �մϴ�.</div>
                    </td>
                </tr>
                <tr>
                    <th class="th-bg text-center align-middle"><span class="red-color">* </span>����</th>
                    <td colspan="3" class="border-bottom">
                        <textarea name="bo_content" class="form-control minH480" required placeholder="�Խñ� ������ �Է����ּ���.">{sBoContent}</textarea>
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
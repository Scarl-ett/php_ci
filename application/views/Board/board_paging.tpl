<nav aria-label="Page navigation">
    <ul class="pagination mb-0">
        {? aPagingVar.iCurrentPage > 1}
        <li class="paga-item">
            <a class="page-link" href="#" data-page="1">
               <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#" data-page="{aPagingVar.iCurrentPage - 1}">
                <span aria-hidden="true">&lt;</span>
            </a>
        </li>
        {/}
        
        {@ range(aPagingVar.iStartPage, aPagingVar.iEndPage)}
            {? aPagingVar.iCurrentPage == .index_ + aPagingVar.iStartPage}
            <li class="page-item active">
                <a class="page-link" href="#" data-page="{aPagingVar.iCurrentPage}">{aPagingVar.iCurrentPage}</a>
            </li>
            {:}
            <li class="page-item">
                <a class="page-link" href="#" data-page="{.index_ + aPagingVar.iStartPage}">{.index_ + aPagingVar.iStartPage}</a>
            </li>
            {/}
        {/}
        
        {? aPagingVar.iCurrentPage < aPagingVar.iTotalPage}
        <li class="page-item">
            <a class="page-link" href="#" data-page="{aPagingVar.iCurrentPage + 1}">
                <span aria-hidden="true">&gt;</span>
            </a>
        </li>
        <li class="paga-item">
            <a class="page-link" href="#" data-page="{aPagingVar.iTotalPage}">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
        {/}
    </ul>
</nav>
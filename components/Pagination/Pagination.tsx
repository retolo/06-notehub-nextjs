import ReactPaginate from "react-paginate";
import css from './Pagination.module.css'


interface PaginationProps{
    currentPage : number
    totalPages : number
    onPageSelect : (page: number) => void
}

export default function Pagination({currentPage , totalPages , onPageSelect }: PaginationProps){
    return(
        <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({selected}) => onPageSelect(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel='→'
            previousLabel='←'
            renderOnZeroPageCount={null}
            breakLabel={'...'}
        
        />
    )
}
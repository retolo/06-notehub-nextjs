'use client'
import css from './App.module.css'
import NoteList from '@/components/NoteList/NoteList'
import { useDebounce } from 'use-debounce'
import Modal from '@/components/Modal/Modal'
import SearchBox from '@/components/SearchBox/SearchBox'
import  { useState, useEffect } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'
import Pagination from '@/components/Pagination/Pagination'
import NoteForm from '@/components/NoteForm/NoteForm'
export default function App(){
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [debouncedSearch] = useDebounce(
        searchQuery,
        1000,
    )

    

    useEffect(() =>{
        
            setCurrentPage(1)
            
        
            
    }, [debouncedSearch])


    
    
        
    const {data} = useQuery({
        queryKey: ['notes', debouncedSearch, currentPage],
        queryFn: () => fetchNotes({
            ...(debouncedSearch.trim() ? {searchText: debouncedSearch}: {}),
            pageQuery: currentPage
        }),
        placeholderData: keepPreviousData,
    })

    

    

   
    

    const totalPages = data?.totalPages ?? 0;
    console.log(totalPages);

    const handleCloseModal = () =>{
        setIsModalOpen(false)
    }
    return(
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox  onChange={setSearchQuery}/>
                <button type='button' onClick={() => setIsModalOpen(true)} className={css.button}>Create note +</button>

                
            </header>
            {data?.notes && data?.notes.length > 0 &&
                <NoteList notes={data?.notes}/>
            }
            {totalPages !== undefined && totalPages > 1 &&
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageSelect={setCurrentPage}/>

            }
            
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <NoteForm onClose={handleCloseModal}/>

                </Modal>
            )}
            
            
        </div>

    )
}
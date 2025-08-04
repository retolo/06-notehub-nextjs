'use client'
import css from './App.module.css'
import NoteList from '@/components/NoteList/NoteList'
import { useDebounce, useDebouncedCallback } from 'use-debounce'
import Modal from '@/components/Modal/Modal'
import SearchBox from '@/components/SearchBox/SearchBox'
import  React, { useState, useEffect, useRef } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'
import Pagination from '@/components/Pagination/Pagination'
import NoteForm from '@/components/NoteForm/NoteForm'
import { Note } from '@/types/note'


interface NotesClientProps {
    initialData: {
        totalPages: number
        notes: Note[]
    }
    initialPage: number
    initialQuery: string
}
export default function NotesClient({initialPage, initialQuery, initialData}: NotesClientProps){
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [debouncedSearch] = useDebounce(
        searchQuery,
        1000,
    )

        
    const changeSearchQuery = useDebouncedCallback((newQuery: string) => {
        setCurrentPage(1);
        setSearchQuery(newQuery);
     }, 300);
    



    


    
    
        
    const {data} = useQuery({
        queryKey: ['notes', debouncedSearch, currentPage],
        queryFn: () => fetchNotes({
            ...(debouncedSearch.trim() ? {searchText: debouncedSearch}: {}),
            pageQuery: currentPage
        }),
        placeholderData: keepPreviousData, initialData
    })

    

    

   
    

    const totalPages = data?.totalPages ?? 0;
    console.log(totalPages);

    const handleCloseModal = () =>{
        setIsModalOpen(false)
    }
    return(
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox  onChange={changeSearchQuery}/>
                <button type='button' onClick={() => setIsModalOpen(true)} className={css.button}>Create note +</button>

                
            </header>
            {data?.notes && data?.notes.length > 0 &&
                <NoteList notes={data?.notes}/>
            }
            {totalPages !== undefined && totalPages > 1 &&
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageSelect={setCurrentPage}/>

            }
            
            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <NoteForm onClose={handleCloseModal}/>

                </Modal>
            )}
            
            
        </div>

    )
}
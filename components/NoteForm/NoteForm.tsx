import css from './NoteForm.module.css'
import { Formik, Form, Field, type FormikHelpers } from 'formik'
import  { useId } from 'react'
import * as Yup from 'yup'
import { createNote } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface FormValues{
    title: string
    content: string
    tag: string

}

const initialValues: FormValues = {
    title: '',
    content: '',
    tag: 'Todo'
}
interface NoteFormProps{
    onClose: () => void
    
}
const Schema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Minimum length 3 symbols')
        .max(50, 'Maximum length 50 symbols')
        .required('Required'),
    content: Yup.string()
        .max(500, 'Maximum length 500 symbols'),
    tag: Yup.string()
        .required('Required')


})
export default function NoteForm({onClose}: NoteFormProps){
    const fieldId = useId();
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createNote,

        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: ['cardNotes']})
        }
    })


    
    

    const handleSubmit =(
        values: FormValues,
        actions: FormikHelpers<FormValues>
    ) =>{
        mutation.mutate(values, {
            onSuccess: () =>{
                actions.resetForm();
                onClose();
            }

        })
        
    }
    return(
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
            {({ errors, touched }) =>(
                <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-title`}>Title</label>
                    <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
                    {errors.title && touched.title && <div className={css.error}>{errors.title}</div>}
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-content`}>Content</label>
                    <Field as='textarea'
                    id={`${fieldId}-content`}
                    name="content"
                    rows={8}
                    className={css.textarea}
                    />
                    {errors.content && touched.content && <div className={css.error}>{errors.content}</div>}
                </div>

                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-tag`}>Tag</label>
                    <Field as='select' id={`${fieldId}-tag`} name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    {errors.tag && touched.tag && <div className={css.error}>{errors.tag}</div>}
                </div>

                <div className={css.actions}>
                    <button onClick={onClose}  type="button" className={css.cancelButton}>
                    Cancel
                    </button>
                    <button
                     
                    type="submit"
                    className={css.submitButton}
                    disabled={false}
                    >
                    Create note
                    </button>
                </div>
            </Form>
            )}
            
        </Formik>

    )
}
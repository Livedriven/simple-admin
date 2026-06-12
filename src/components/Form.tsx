import { useState } from 'react'
import '../styles/app.css'
import Swal from 'sweetalert2'
import  type { Person } from '../validators/validator.tsx'; 

type OnAddPerson = {
    onAddPerson: (person: Person) => void;
    onDeletePeople: () => void;
}

export default function Form({onAddPerson,onDeletePeople}:OnAddPerson) {
    const [person, setPerson] = useState({ name: '', birthDate: '' })

    function handleChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const {name,value} = event.target

        setPerson({
            ...person,
            [name]:value
        })
    }

    function handleSubmit(event:React.SubmitEvent<HTMLFormElement>){
        event.preventDefault()
        if(person.name && person.birthDate){  
            onAddPerson(person);
            setPerson({name: '', birthDate: ''})
        }else{
            Swal.fire(
                {
                    title:'Dados incompletos',
                    text:'Nome e data de aniversarios devem esta preenchidos',
                    icon:'error'
                }
            )
        }
    }
    
    function handleCleanPeople(){
        onDeletePeople()
    }

    return (
        <>
            <form className='form' onSubmit={handleSubmit}>
                <label htmlFor="nome">
                    <h3 className='label-title'>Nome:</h3>
                    <input type="text" value={person.name} name='name' id='nome' className='input-name field' placeholder='Digite seu nome:' onChange={handleChanged} />
                </label>
                <label htmlFor="birthDate">
                    <h3 className='label-title'>
                        Data de Aniversario deste ano:
                    </h3>
                    <input type="date" value={person.birthDate} name='birthDate'  id='birthDate' className='input-birthdate field'onChange={handleChanged}/>
                </label>

                <button type='submit' className='register-person'>Salvar</button>
                <button type='button' className='clear-button' onClick={handleCleanPeople}>Limpar</button>
            </form>
        </>
    )
} 
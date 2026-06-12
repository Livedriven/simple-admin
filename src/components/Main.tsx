import { useState, useEffect } from 'react';
import '../styles/app.css';
import Form from './Form';
import PeopleRender from './PeopleRender';
import type { Person } from '../validators/validator.tsx';
import * as Storage from '../services/localStorange';


export default function Main() {
    const [people, setPeople] = useState<Person[]>(() => {
        return Storage.getPeople()
    })

    useEffect(() => {
        Storage.save(people)
    }, [people])

    function handlePeople({ name, birthDate }: Person) {
        setPeople([...people, { name: name, birthDate: birthDate }])
    }

    function handleDeletePeople() {
        setPeople([])
        Storage.save(people)
    }

    return (
        <>
            <main className='container-main'>
                <section className='section'>
                    <Form onAddPerson={handlePeople} onDeletePeople={handleDeletePeople} />
                </section>
                <PeopleRender people={people} />
            </main>
        </>
    )
}
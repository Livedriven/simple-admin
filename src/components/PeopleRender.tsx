import '../styles/app.css';
import type { PeopleProps } from '../validators/validator';
import CardPerson from './CardPerson';

export default function PeopleRender({ people }: PeopleProps) {
    return (
        <>
            <section className='section-table'>

                {
                    people.length === 0 ? (
                        <h3>Nenhum dado disponível</h3>
                    ): (
                    <table className='people-table'>
                        <thead className='header-table'>
                            <tr className='header-row'>
                                <th className='header-cell'>Nome</th>
                                <th className='header-cell'>Data de Nascimento</th>
                                <th className='header-delete'></th>
                            </tr>
                        </thead>
                        <tbody className='table-body'>
                            {people.map(person => (
                                <CardPerson name={person.name} birthDate={person.birthDate}/>
                            ))}
                        </tbody>
                    </table>)}
            </section>
        </>
    )
}
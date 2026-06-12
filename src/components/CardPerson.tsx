import '../styles/app.css';
import type { Person } from '../validators/validator';
import lixeira from '../assets/lixeira.png'

export default function CardPerson({ name,birthDate }:Person){
    return(
        <>
            <tr>
                <td className='name-cell'>{name}</td>
                <td className='birthdate-cell'>{birthDate}</td>
                <td className='delete-cell'>
                    <button className='delete-btn'>
                        <img src={lixeira} alt="Excluir" />
                    </button>
                </td>
            </tr>
        </>
    )
}
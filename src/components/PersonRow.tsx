import lixeira from '../assets/lixeira.png';
import { formatBirthDate, type Person } from '../schemas/person';

type PersonRowProps = {
  person: Person;
  onDelete: (id: string) => void;
};

export default function PersonRow({ person, onDelete }: PersonRowProps) {
  const formattedBirthDate = formatBirthDate(person.birthDate);

  return (
    <tr>
      <th className="name-cell" scope="row">
        {person.name}
      </th>
      <td className="birthdate-cell">
        <time dateTime={person.birthDate}>{formattedBirthDate}</time>
      </td>
      <td className="delete-cell">
        <button
          type="button"
          className="delete-btn"
          aria-label={`Excluir registro de ${person.name}`}
          onClick={() => onDelete(person.id)}
        >
          <img src={lixeira} alt="" width="20" height="20" />
        </button>
      </td>
    </tr>
  );
}

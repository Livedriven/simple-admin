import type { Person } from '../schemas/person';
import PersonRow from './PersonRow';

type PeopleTableProps = {
  people: Person[];
  onDeletePerson: (id: string) => void;
};

export default function PeopleTable({
  people,
  onDeletePerson,
}: PeopleTableProps) {
  return (
    <section className="section-table">
      <h2 id="people-table-title" className="section-title">
        Pessoas cadastradas
      </h2>

      {people.length === 0 ? (
        <p className="empty-state" role="status" aria-live="polite">
          Nenhum dado disponível
        </p>
      ) : (
        <div
          className="table-scroll"
          role="region"
          aria-labelledby="people-table-title"
          tabIndex={0}
        >
          <table className="people-table">
            <caption className="sr-only">
              Pessoas cadastradas e suas datas de nascimento
            </caption>
            <thead>
              <tr className="header-row">
                <th className="header-cell" scope="col">
                  Nome
                </th>
                <th className="header-cell" scope="col">
                  Data de nascimento
                </th>
                <th className="header-delete" scope="col">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  onDelete={onDeletePerson}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

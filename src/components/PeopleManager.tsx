import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {
  createPerson,
  isDuplicatePerson,
  MAX_PEOPLE,
  type Person,
  type PersonInput,
} from '../schemas/person';
import {
  clearPeople,
  loadPeople,
  savePeople,
} from '../services/peopleStorage';
import PeopleTable from './PeopleTable';
import PersonForm from './PersonForm';
import type { AddPersonResult } from './PersonForm';

export default function PeopleManager() {
  const [initialData] = useState(loadPeople);
  const [people, setPeople] = useState(initialData.people);
  const [storageWarning, setStorageWarning] = useState(
    initialData.warning ?? '',
  );
  const initialRepairHandled = useRef(false);

  useEffect(() => {
    if (!initialData.needsSave || initialRepairHandled.current) {
      return;
    }

    initialRepairHandled.current = true;
    const result = savePeople(initialData.people);

    if (!result.ok) {
      Promise.resolve().then(() => setStorageWarning(result.message));
    }
  }, [initialData]);

  function persist(nextPeople: Person[]) {
    const result = savePeople(nextPeople);
    setStorageWarning(result.ok ? '' : result.message);
  }

  function handleAddPerson(input: PersonInput): AddPersonResult {
    if (people.length >= MAX_PEOPLE) {
      return {
        ok: false,
        message: `O limite de ${MAX_PEOPLE} pessoas foi atingido.`,
      };
    }

    if (people.some((person) => isDuplicatePerson(person, input))) {
      return {
        ok: false,
        message: 'Esta pessoa já possui um cadastro com a mesma data.',
      };
    }

    try {
      const usedIds = new Set(people.map((person) => person.id));
      const nextPeople = [...people, createPerson(input, usedIds)];

      setPeople(nextPeople);
      persist(nextPeople);
      return { ok: true };
    } catch {
      return {
        ok: false,
        message: 'Não foi possível criar o registro.',
      };
    }
  }

  function handleDeletePerson(id: string) {
    const nextPeople = people.filter((person) => person.id !== id);

    if (nextPeople.length === people.length) {
      return;
    }

    setPeople(nextPeople);
    persist(nextPeople);
  }

  async function handleClearPeople(): Promise<boolean> {
    const confirmation = await Swal.fire({
      title: 'Limpar todos os registros?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, limpar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmation.isConfirmed) {
      return false;
    }

    const result = clearPeople();

    if (!result.ok) {
      setStorageWarning(result.message);
      return false;
    }

    setPeople([]);
    setStorageWarning('');
    return true;
  }

  return (
    <main className="container-main">
      <section className="section" aria-labelledby="registration-title">
        <h2 className="section-title" id="registration-title">
          Cadastrar pessoa
        </h2>
        <PersonForm
          onAddPerson={handleAddPerson}
          onClearPeople={handleClearPeople}
          canClear={people.length > 0 || Boolean(storageWarning)}
        />
      </section>

      {storageWarning && (
        <p className="storage-warning" role="alert">
          {storageWarning}
        </p>
      )}

      <PeopleTable people={people} onDeletePerson={handleDeletePerson} />
    </main>
  );
}

import {
  createPerson,
  MAX_PEOPLE,
  peopleSchema,
  personInputSchema,
  personSchema,
  type Person,
} from '../schemas/person';

const STORAGE_KEY = 'people';

export type LoadPeopleResult = {
  people: Person[];
  needsSave: boolean;
  warning?: string;
};

export type StorageResult =
  | { ok: true }
  | { ok: false; message: string };

function hasStoredShape(value: unknown, person: Person): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    Object.keys(record).length === 3 &&
    record.id === person.id &&
    record.name === person.name &&
    record.birthDate === person.birthDate
  );
}

export function loadPeople(): LoadPeopleResult {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (storedValue === null) {
      return { people: [], needsSave: false };
    }

    const parsed: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsed)) {
      return {
        people: [],
        needsSave: false,
        warning: 'Os dados salvos possuem um formato inválido.',
      };
    }

    const people: Person[] = [];
    const usedIds = new Set<string>();
    let ignored = 0;
    let repaired = false;

    for (let index = 0; index < parsed.length; index += 1) {
      if (people.length >= MAX_PEOPLE) {
        ignored += parsed.length - index;
        repaired = true;
        break;
      }

      const value = parsed[index];
      const currentPerson = personSchema.safeParse(value);

      if (currentPerson.success && !usedIds.has(currentPerson.data.id)) {
        usedIds.add(currentPerson.data.id);
        people.push(currentPerson.data);

        if (!hasStoredShape(value, currentPerson.data)) {
          repaired = true;
        }

        continue;
      }

      const legacyPerson = personInputSchema.safeParse(value);

      if (!legacyPerson.success) {
        ignored += 1;
        repaired = true;
        continue;
      }

      try {
        const person = createPerson(legacyPerson.data, usedIds);
        usedIds.add(person.id);
        people.push(person);
        repaired = true;
      } catch {
        ignored += 1;
        repaired = true;
      }
    }

    const ignoredLabel =
      ignored === 1
        ? 'registro não foi carregado'
        : 'registros não foram carregados';
    const warning = ignored > 0 ? `${ignored} ${ignoredLabel}.` : undefined;

    return {
      people,
      needsSave: repaired && people.length > 0,
      warning,
    };
  } catch {
    return {
      people: [],
      needsSave: false,
      warning: 'Não foi possível ler os dados salvos neste navegador.',
    };
  }
}

export function savePeople(people: Person[]): StorageResult {
  const validatedPeople = peopleSchema.safeParse(people);

  if (!validatedPeople.success) {
    return { ok: false, message: 'A lista contém dados inválidos.' };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedPeople.data));
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: 'Não foi possível salvar os dados neste navegador.',
    };
  }
}

export function clearPeople(): StorageResult {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: 'Não foi possível remover os dados salvos.',
    };
  }
}
